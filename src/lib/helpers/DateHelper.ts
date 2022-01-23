import { PatientRecord } from '../types/PatientRecord';

export function getFormattedDate(record: PatientRecord) {
  return new Date(record.date * 1000).toUTCString();
}
