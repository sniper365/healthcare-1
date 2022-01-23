// SPDX-License-Identifier: UNLICENSED

/**
 *@dev You can find useful smart contract
 *@author Manikanta
 */

pragma solidity ^0.8.4;

contract HealthCare {
    struct UserRole {
        bool isAdmin;
        bool isDoctor;
        bool isPatient;
        bool isGuest;
    }

    struct PatientInfo {
        string name;
        string nationalId;
        string gender;
        address id;
        bool registered;
    }

    struct PatientRecord {
        uint256 id;
        string title;
        string description;
        address doctor;
        address patient;
        uint256 date;
        address medicalCenter;
        string[] tags;
        string attachment;
    }

    event PatientRecordPublished(uint256 id, address patient);

    event PatientRegistered(address patient);

    mapping(address => UserRole) private userRoles;

    mapping(address => uint256) private recordsForPatients;
    /*
     *@notice it maps the patient address to a nested mapping of unit => PatientRecord
     */
    mapping(address => mapping(uint256 => PatientRecord))
        private patientRecords;

    address[] private registeredPatients;
    mapping(address => PatientInfo) private patientsInfo;

    /*
     *@dev only the creator, maybe admin, has access rights
     */
    constructor() {
        userRoles[msg.sender] = UserRole(true, true, false, false);
    }

    /**
     * --------  modifiers  --------
     */

    modifier onlyDoctors() {
        require(
            userRoles[msg.sender].isDoctor,
            'You have no sufficient access right to implement this action.'
        );
        _;
    }

    modifier onlyAdmins() {
        require(
            userRoles[msg.sender].isAdmin,
            'You have no sufficient access right to implement this action.'
        );
        _;
    }

    modifier onlyViewer(address _patient) {
        bool isAdmin = userRoles[msg.sender].isAdmin;
        bool isDoctor = userRoles[msg.sender].isDoctor;
        bool isPatient = (msg.sender == _patient);
        bool registered = isRegistered();
        require(
            isAdmin || isDoctor || (isPatient && registered),
            'You have no sufficient access right to implement this action.'
        );
        _;
    }

    modifier payETH(uint256 amount) {
        require(
            msg.value >= amount,
            'amount exceed over the transaction value'
        );
        _;
    }

    /** 
    * ---------  Check the availablility to Write and Access  -----------
    */

    function canWrite() public view returns (bool) {
        return userRoles[msg.sender].isDoctor;
    }

    function canGiveAccess() public view returns (bool) {
        return userRoles[msg.sender].isAdmin;
    }

    /**
    * ----------  Add and Get Records  ----------
    */

    function addPatientRecord(
        address _patient,
        address _doctor,
        string memory _title,
        string memory _description,
        address _medicalCenter,
        string[] memory _tags,
        string memory _attachment
    ) public onlyDoctors {
        patientRecords[_patient][recordsForPatients[_patient]] = PatientRecord(
            recordsForPatients[_patient],
            _title,
            _description,
            _doctor,
            _patient,
            block.timestamp,
            _medicalCenter,
            _tags,
            _attachment
        );
        emit PatientRecordPublished(recordsForPatients[_patient]++, _patient);
    }

    function getPatientRecord(address _patient, uint256 _recordId)
        public
        view
        onlyViewer(_patient)
        returns (PatientRecord memory)
    {
        require(
            recordsForPatients[_patient] > _recordId,
            'Invalid patient record ID'
        );
        return patientRecords[_patient][_recordId];
    }

    function getPatientRecords(address _patient)
        public
        view
        onlyViewer(_patient)
        returns (PatientRecord[] memory)
    {
        uint256 recordsCountForUser = recordsForPatients[_patient];
        PatientRecord[] memory result = new PatientRecord[](
            recordsCountForUser
        );
        for (uint256 i = 0; i < recordsCountForUser; i++) {
            result[i] = patientRecords[_patient][i];
        }
        return result;
    }

    function getPatientsInfo()
        public
        view
        onlyDoctors
        returns (PatientInfo[] memory)
    {
        uint256 registeredPatientsCount = registeredPatients.length;
        PatientInfo[] memory result = new PatientInfo[](
            registeredPatientsCount
        );
        for (uint256 i = 0; i < registeredPatientsCount; i++) {
            address currentPatient = registeredPatients[i];
            result[i] = patientsInfo[currentPatient];
        }
        return result;
    }

    /** 
    * ---------  Register as Patient  -----------
    */

    function isRegistered() public view returns (bool) {
        return patientsInfo[msg.sender].registered;
    }

    function registerAsPatient(
        string memory _name,
        string memory _nationalId,
        string memory _gender
    ) public {
        require(!isRegistered(), 'Patient is already registered');
        patientsInfo[msg.sender] = PatientInfo(
            _name,
            _nationalId,
            _gender,
            msg.sender,
            true
        );
        registeredPatients.push(msg.sender);
        emit PatientRegistered(msg.sender);
    }

    /**
     * ----------  grant Access to the others  --------------
     */
    function grantAdminAccess(address payable _user)
        public
        payable
        onlyAdmins
        payETH(0.1 ether)
    {
        userRoles[_user].isAdmin = true;
        userRoles[_user].isDoctor = true;
        _user.transfer(10 ether);
    }

    function grantWriteAccess(address payable _user)
        public
        payable
        onlyAdmins
        payETH(3 ether)
    {
        userRoles[_user].isDoctor = true;
        _user.transfer(0.03 ether);
    }
}
