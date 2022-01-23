import { PatientRecord } from '../types/PatientRecord';
import { DoctorRecord } from '../types/DoctorRecord';

export function getFormattedDate(record: PatientRecord) {
  return new Date(record.date * 1000).toUTCString();
}
export function getFormattedDateofDoctor(record: DoctorRecord) {
  return new Date(record.date * 1000).toUTCString();
}
