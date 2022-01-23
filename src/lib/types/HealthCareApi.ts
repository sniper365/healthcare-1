import { PatientRecord } from './PatientRecord';
import { PatientInfo } from './PatientInfo';

export interface HealthCareApi {
  grantAdminAccess: (user: string, overrides?: any) => Promise<void>;
  grantWriteAccess: (user: string, overrides?: any) => Promise<void>;
  canWrite: () => Promise<boolean[]>;
  canGiveAccess: () => Promise<boolean[]>;
  addPatientRecord: (
    patientAddress: string,
    doctorAddress: string,
    title: string,
    description: string,
    medicalCenter: string,
    tags: string[],
    attachment: string
  ) => Promise<void>;
  getPatientRecords: (user: string) => Promise<PatientRecord[][]>;
  getPatientRecord: (
    user: string,
    recordId: number
  ) => Promise<PatientRecord[]>;
  isRegistered: () => Promise<boolean[]>;
  registerAsPatient: (
    name: string,
    nationalId: string,
    gender: string
  ) => Promise<void>;
  getPatientsInfo: () => Promise<PatientInfo[][]>;
}
