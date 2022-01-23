// SPDX-License-Identifier: UNLICENSED

/**
 *@dev You can find useful smart contract
 *@author Manikanta
 */

pragma solidity ^0.8.4;

contract HealthCare {
    struct UserRole {
        bool isAdmin;
        bool isRegisteredDoctor;
        bool isUnregisteredDoctor;
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

    struct DoctorInfo {
        string name;
        string nationalId;
        string gender;
        string specialty;
        uint yearsOfExperience;
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

    struct DoctorRecord {
        uint256 id;
        address doctor;
        string name;
        string nationalId;
        string gender;
        string specialty;
        uint yearsOfExperience;
        uint256 date;
    }
    event PatientRecordPublished(uint256 id, address patient);
    event DoctorRecordPublished(uint256 id, address doctor);

    event PatientRegistered(address patient);
    event DoctorRegistered(address doctor);

    mapping(address => UserRole) private userRoles;

    mapping(address => uint256) private recordsForPatients;
    mapping(address => uint256) private recordsForDoctors;
    /*
     *@notice it maps the patient address to a nested mapping of unit => PatientRecord
     */
    mapping(address => mapping(uint256 => PatientRecord))
        private patientRecords;
    mapping(address => DoctorRecord) private doctorRecords;

    address[] private registeredPatients;
    address[] private registeredDoctors;

    mapping(address => PatientInfo) private patientsInfo;
    mapping(address => DoctorInfo) private doctorsInfo;

    /*
     *@dev only the creator, maybe admin, has access rights
     */
    constructor() {
        userRoles[msg.sender] = UserRole(true, true,true, false, false);
    }

    /**
     * --------  modifiers  --------
     */

    modifier onlyRegisteredDoctors() {
        require(
            userRoles[msg.sender].isRegisteredDoctor,
            'You are not registered doctor.'
        );
        _;
    }
    modifier onlyUnregisteredDoctors() {
        require(
            userRoles[msg.sender].isUnregisteredDoctor,
            'You are not unregistered doctor.'
        );
        _;
    }

    modifier onlyAdmins() {
        require(
            userRoles[msg.sender].isAdmin,
            'You are not admin.'
        );
        _;
    }

    modifier onlyViewer(address _patient) {
        bool isAdmin = userRoles[msg.sender].isAdmin;
        bool isRegisteredDoctor = userRoles[msg.sender].isRegisteredDoctor;
        bool isUnregisteredDoctor = userRoles[msg.sender].isUnregisteredDoctor;
        bool isPatient = (msg.sender == _patient);
        bool registered = isRegisteredAsPatient();
        require(
            isAdmin || isRegisteredDoctor || isUnregisteredDoctor || (isPatient && registered),
            'You are not viewer.'
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
        return userRoles[msg.sender].isUnregisteredDoctor || userRoles[msg.sender].isRegisteredDoctor;
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
    ) public onlyRegisteredDoctors {
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

    function getDoctorsInfo()
        public
        view
        returns (DoctorInfo[] memory)
    {
        uint256 registeredDoctorsCount = registeredDoctors.length;
        DoctorInfo[] memory result = new DoctorInfo[](
            registeredDoctorsCount
        );
        for (uint256 i = 0; i < registeredDoctorsCount; i++) {
            address currentDoctor = registeredDoctors[i];
            result[i] = doctorsInfo[currentDoctor];
        }
        return result;
    }

    /** 
    * ---------  Register as Patient  -----------
    */

    function isRegisteredAsPatient() public view returns (bool) {
        return patientsInfo[msg.sender].registered;
    }

    function registerAsPatient(
        string memory _name,
        string memory _nationalId,
        string memory _gender
    ) public {
        require(!isRegisteredAsPatient(), 'Patient is already registered');
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
    * ---------  Register as Doctor  -----------
    */

    function isRegisteredAsDoctor() public view returns (bool) {
        return doctorsInfo[msg.sender].registered;
    }

    // function registerAsDoctor(
    //     string memory _name,
    //     string memory _nationalId,
    //     string memory _gender,
    //     string memory _specialty,
    //     uint256 _yearsOfExperience
    // ) public onlyUnregisteredDoctors {
    //     require(!isRegisteredAsDoctor(), 'Doctor is already registered');
    //     doctorsInfo[msg.sender] = DoctorInfo(
    //         _name,
    //         _nationalId,
    //         _gender,
    //         _specialty,
    //         _yearsOfExperience,
    //         msg.sender,
    //         true
    //     );
    //     registeredDoctors.push(msg.sender);
    //     userRoles[msg.sender].isRegisteredDoctor;
    //     emit DoctorRegistered(msg.sender);
    // }
    function registerAsDoctor(
        address _doctor,
        string memory _name,
        string memory _nationalId,
        string memory _gender,
        string memory _specialty,
        uint256 _yearsOfExperience
    ) public onlyUnregisteredDoctors {
        require(!isRegisteredAsDoctor(), 'Doctor is already registered');
        doctorsInfo[msg.sender] = DoctorInfo(
            _name,
            _nationalId,
            _gender,
            _specialty,
            _yearsOfExperience,
            msg.sender,
            true
        );
        doctorRecords[_doctor] = DoctorRecord(
            recordsForDoctors[_doctor],
            _doctor,
            _name,
            _nationalId,
            _gender,
            _specialty,
            _yearsOfExperience,
            block.timestamp
        );
        registeredDoctors.push(msg.sender);
        userRoles[_doctor].isRegisteredDoctor = true;
        emit DoctorRecordPublished(recordsForDoctors[_doctor]++, _doctor);
    }

    function getDoctorRecord(address _doctor)
        public
        view
        returns (DoctorRecord memory)
    {
        // require(
        //     recordsForDoctors[_doctor] > _recordId,
        //     'Invalid doctor record ID'
        // );
        return doctorRecords[_doctor];
    }

    function getDoctorRecords(address _doctor)
        public
        view
        returns (DoctorRecord[] memory)
    {
        uint256 recordsCountForUser = recordsForDoctors[_doctor];
        DoctorRecord[] memory result = new DoctorRecord[](
            recordsCountForUser
        );
        for (uint256 i = 0; i < recordsCountForUser; i++) {
            result[i] = doctorRecords[_doctor];
        }
        return result;
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
        userRoles[_user].isRegisteredDoctor = true;
        _user.transfer(0.1 ether);
    }

    function grantWriteAccess(address payable _user)
        public
        payable
        onlyAdmins
        payETH(0.03 ether)
    {
        userRoles[_user].isUnregisteredDoctor = true;
        _user.transfer(0.03 ether);
    }
}
