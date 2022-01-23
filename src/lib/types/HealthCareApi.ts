import { PatientRecord } from './PatientRecord';
import { PatientInfo } from './PatientInfo';
import { DoctorInfo } from './DoctorInfo';
import { DoctorRecord } from './DoctorRecord';

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
  getDoctorRecords: (user: string) => Promise<DoctorRecord[][]>;
  getDoctorRecord: (
    user: string
  ) => Promise<DoctorRecord[]>;
  isRegisteredAsPatient: () => Promise<boolean[]>;
  registerAsPatient: (
    name: string,
    nationalId: string,
    gender: string
  ) => Promise<void>;
  isRegisteredAsDoctor: () => Promise<boolean[]>;
  registerAsDoctor: (
    doctorAddress: string,
    name: string,
    nationalId: string,
    gender: string,
    specialty: string,
    yearsOfExperience: number
  ) => Promise<void>;
  getPatientsInfo: () => Promise<PatientInfo[][]>;
  getDoctorsInfo: () => Promise<DoctorInfo[][]>;
}
