import { HealthCareApi } from '../lib/types/HealthCareApi';
import HealthCareAbi from '../contracts/HealthCare.json';
import { useContract } from './useContract';

export function useHealthCareApi(): HealthCareApi {
  const contractAddress = HealthCareAbi.networks['5777'].address;
  const { functions } = useContract(contractAddress, HealthCareAbi.abi);
  return {
    grantAdminAccess: functions.grantAdminAccess,
    canWrite: functions.canWrite,
    grantWriteAccess: functions.grantWriteAccess,
    addPatientRecord: functions.addPatientRecord,
    getPatientRecords: functions.getPatientRecords,
    getPatientRecord: functions.getPatientRecord,
    isRegistered: functions.isRegistered,
    registerAsPatient: functions.registerAsPatient,
    getPatientsInfo: functions.getPatientsInfo,
    canGiveAccess: functions.canGiveAccess,
  };
}
