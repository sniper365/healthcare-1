const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised).should();
const expect = chai.expect;
const ethers = require('@ethersproject/units');
const HealthCare = artifacts.require('./HealthCare.sol');

contract('HealthCare', (accounts) => {
  const owner = accounts[0];

  it('Admin should have all rights', async () => {
    const healthCareInstance = await HealthCare.deployed();
    const canWrite = await healthCareInstance.canWrite({ from: owner });
    const canGiveAccess = await healthCareInstance.canGiveAccess({
      from: owner,
    });
    expect(canWrite).to.be.true;
    expect(canGiveAccess).to.be.true;
  });

  it('Admin should create and view new medical record', async () => {
    const healthCareInstance = await HealthCare.deployed();
    const patient = accounts[5];

    await healthCareInstance.addPatientRecord(
      patient,
      owner,
      'test title',
      'test description',
      accounts[3],
      ['tag1', 'tag2'],
      'attachment location',
      { from: owner }
    );

    const PatientRecords = await healthCareInstance.getPatientRecords(patient, {
      from: owner,
    });
    expect(PatientRecords.length).to.eq(1);
    const PatientRecord = PatientRecords[0];
    expectPatientRecord(
      PatientRecord,
      '0',
      'test title',
      'test description',
      owner,
      patient,
      accounts[3],
      ['tag1', 'tag2'],
      'attachment location'
    );
  });

  it('Admin should not be able to grant access if msg value is not sufficient', async () => {
    const healthCareInstance = await HealthCare.deployed();
    await healthCareInstance.grantAdminAccess(accounts[5], {
      from: owner,
      value: 0,
    }).should.be.rejected;
  });

  it('Admin should grant edit access to new user', async () => {
    const healthCareInstance = await HealthCare.deployed();
    const editorUser = accounts[1];
    await healthCareInstance.grantWriteAccess(editorUser, {
      from: owner,
      value: ethers.parseEther('1'),
    });
    const canWrite = await healthCareInstance.canWrite({
      from: editorUser,
    });
    const canGiveAccess = await healthCareInstance.canGiveAccess({
      from: editorUser,
    });
    expect(canWrite).to.be.true;
    expect(canGiveAccess).to.be.false;
  });

  it('Editor should create and view new medical record', async () => {
    const healthCareInstance = await HealthCare.deployed();
    const editorUser = accounts[1];
    const patient = accounts[5];

    await healthCareInstance.addPatientRecord(
      patient,
      editorUser,
      'new test title',
      'new test description',
      accounts[9],
      ['tag3', 'tag4'],
      'attachment location',
      { from: editorUser }
    );

    const PatientRecords = await healthCareInstance.getPatientRecords(patient, {
      from: editorUser,
    });
    expect(PatientRecords.length).to.eq(2);
    const PatientRecord = PatientRecords[1];
    expectPatientRecord(
      PatientRecord,
      '1',
      'new test title',
      'new test description',
      editorUser,
      patient,
      accounts[9],
      ['tag3', 'tag4'],
      'attachment location'
    );
  });

  it('Patient should not be able to view assigned medical record if not registered', async () => {
    const healthCareInstance = await HealthCare.deployed();
    const patient = accounts[5];

    const isRegistered = await healthCareInstance.isRegistered({
      from: patient,
    });
    expect(isRegistered).to.be.false;

    await healthCareInstance.getPatientRecords(patient, {
      from: patient,
    }).should.be.rejected;
  });

  it('Patient should not be able to get patient information', async () => {
    const healthCareInstance = await HealthCare.deployed();
    const patient = accounts[5];

    await healthCareInstance.getPatientsInfo({ from: patient }).should.be
      .rejected;
  });

  it('Patient should be able to register', async () => {
    const healthCareInstance = await HealthCare.deployed();
    const patient = accounts[5];

    let isRegistered = await healthCareInstance.isRegistered({ from: patient });
    expect(isRegistered).to.be.false;

    await healthCareInstance.registerAsPatient('Rado', '31/12/1998', 'male', {
      from: patient,
    });
    isRegistered = await healthCareInstance.isRegistered({ from: patient });
    expect(isRegistered).to.be.true;
  });

  it('Patient should not be able to register twice', async () => {
    const healthCareInstance = await HealthCare.deployed();
    const patient = accounts[7];

    let isRegistered = await healthCareInstance.isRegistered({ from: patient });
    expect(isRegistered).to.be.false;

    await healthCareInstance.registerAsPatient('Rali', '27/02/1998', 'female', {
      from: patient,
    });
    isRegistered = await healthCareInstance.isRegistered({ from: patient });
    expect(isRegistered).to.be.true;

    await healthCareInstance.registerAsPatient(
      'Rali but edited',
      '27/02/1998',
      'female',
      { from: patient }
    ).should.be.rejected;
  });

  it('Editors should be able to get array of registered patients', async () => {
    const healthCareInstance = await HealthCare.deployed();
    const editorUser = accounts[1];
    const firstPatient = accounts[5];
    const secondPatient = accounts[7];

    const result = await healthCareInstance.getPatientsInfo({
      from: editorUser,
    });
    expect(result.length).to.eq(2);
    expect(result[0].id).to.eq(firstPatient);
    expect(result[1].id).to.eq(secondPatient);
    expect(result[0].name).to.eq('Rado');
    expect(result[1].name).to.eq('Rali');
  });

  it('Editor should view specific assigned medical record', async () => {
    const healthCareInstance = await HealthCare.deployed();
    const editor = accounts[1];
    const patient = accounts[5];

    const PatientRecord = await healthCareInstance.getPatientRecord(
      patient,
      1,
      {
        from: editor,
      }
    );
    expectPatientRecord(
      PatientRecord,
      '1',
      'new test title',
      'new test description',
      accounts[1],
      patient,
      accounts[9],
      ['tag3', 'tag4'],
      'attachment location'
    );
  });

  it('Patient should view all assigned medical records', async () => {
    const healthCareInstance = await HealthCare.deployed();
    const patient = accounts[5];

    const PatientRecords = await healthCareInstance.getPatientRecords(patient, {
      from: patient,
    });
    expect(PatientRecords.length).to.eq(2);
    const PatientRecord = PatientRecords[1];
    expectPatientRecord(
      PatientRecord,
      '1',
      'new test title',
      'new test description',
      accounts[1],
      patient,
      accounts[9],
      ['tag3', 'tag4'],
      'attachment location'
    );
  });

  it('Patient should view specific assigned medical record', async () => {
    const healthCareInstance = await HealthCare.deployed();
    const patient = accounts[5];

    const PatientRecord = await healthCareInstance.getPatientRecord(
      patient,
      1,
      {
        from: patient,
      }
    );
    expectPatientRecord(
      PatientRecord,
      '1',
      'new test title',
      'new test description',
      accounts[1],
      patient,
      accounts[9],
      ['tag3', 'tag4'],
      'attachment location'
    );
  });

  it('Editor should not be able to grant access', async () => {
    const healthCareInstance = await HealthCare.deployed();
    const editorUser = accounts[1];
    await healthCareInstance.grantAdminAccess(accounts[5], { from: editorUser })
      .should.be.rejected;
  });

  it('Patient should not be able to view other patient records', async () => {
    const healthCareInstance = await HealthCare.deployed();
    const currentUser = accounts[6];
    const canWrite = await healthCareInstance.canWrite({ from: currentUser });
    const canGiveAccess = await healthCareInstance.canGiveAccess({
      from: currentUser,
    });
    expect(canWrite).to.be.false;
    expect(canGiveAccess).to.be.false;
    await healthCareInstance.getPatientRecords(accounts[5], {
      from: currentUser,
    }).should.be.rejected;
  });

  it('Patient should not be able to edit', async () => {
    const healthCareInstance = await HealthCare.deployed();
    const patient = accounts[6];
    const canWrite = await healthCareInstance.canWrite({ from: patient });
    expect(canWrite).to.be.false;
    await healthCareInstance.addPatientRecord(
      patient,
      accounts[1],
      'malicious',
      'malicious',
      accounts[9],
      ['tag3'],
      'malicious location',
      { from: patient }
    ).should.be.rejected;
  });

  it('Patient should not be able to grant access', async () => {
    const healthCareInstance = await HealthCare.deployed();
    const patient = accounts[6];
    await healthCareInstance.grantAdminAccess(patient, { from: patient }).should
      .be.rejected;
  });
});

function expectPatientRecord(
  PatientRecord,
  id,
  title,
  description,
  doctor,
  patient,
  medicalCenter,
  tags,
  attachment
) {
  expect(PatientRecord.id).to.eq(id);
  expect(PatientRecord.title).to.eq(title);
  expect(PatientRecord.description).to.eq(description);
  expect(PatientRecord.doctor).to.eq(doctor);
  expect(PatientRecord.patient).to.eq(patient);
  expect(PatientRecord.medicalCenter).to.eq(medicalCenter);
  tags.forEach((tag) => expect(PatientRecord.tags).to.contain(tag));
  expect(PatientRecord.attachment).to.contain(attachment);
}
