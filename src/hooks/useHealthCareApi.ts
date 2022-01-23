import { HealthCareApi } from '../lib/types/HealthCareApi';
import HealthCareAbi from '../contracts/HealthCare.json';
import { useContract } from './useContract';

export function useHealthCareApi(): HealthCareApi {
  const contractAddress = HealthCareAbi.networks['5777'].address;
  const { functions } = useContract(contractAddress, HealthCareAbi.abi);
  return {
    grantAdminAccess: functions.grantAdminAccess,
    grantWriteAccess: functions.grantWriteAccess,
    canWrite: functions.canWrite,
    canGiveAccess: functions.canGiveAccess,

    addPatientRecord: functions.addPatientRecord,
    getPatientsInfo: functions.getPatientsInfo,
    getPatientRecords: functions.getPatientRecords,
    getPatientRecord: functions.getPatientRecord,

    getDoctorsInfo: functions.getDoctorsInfo,
    getDoctorRecord: functions.getDoctorRecord,
    getDoctorRecords: functions.getDoctorRecords,

    isRegisteredAsPatient: functions.isRegisteredAsPatient,
    registerAsPatient: functions.registerAsPatient,
    
    isRegisteredAsDoctor: functions.isRegisteredAsDoctor,
    registerAsDoctor: functions.registerAsDoctor,
  };
}
