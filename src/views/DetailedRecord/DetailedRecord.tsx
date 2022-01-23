import { isAddress } from '@ethersproject/address';
import { Card, CardActions, CardContent, Typography } from '@material-ui/core';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAppLoading } from '../../hooks/useAppLoading';
import { useHealthCareApi } from '../../hooks/useHealthCareApi';
import { useTranslator } from '../../hooks/useTranslator';
import { getFormattedDate } from '../../lib/helpers/DateHelper';
import { PatientRecord } from '../../lib/types/PatientRecord';
import { NotFound } from '../../components/NotFound/NotFound';
import { PatientAddressAccess } from '../../components/PatientAddressAccess/PatientAddressAccess';
import { FileDownloadButton } from '../../components/Inputs/FileDownloadButton';
import { Tags } from './Tags';
import './DetailedRecord.css';

export function DetailedRecord() {
  const { getPatientRecord } = useHealthCareApi();
  const { patientAddress, patientRecordId } =
    useParams<{ patientAddress: string; patientRecordId: string }>();
  const [record, setRecord] = useState<PatientRecord>();
  const { dispatchLoading, dispatchNotLoading } = useAppLoading();
  const { translate } = useTranslator();

  const isRecordIdValid = () =>
    !isNaN(+patientRecordId) && isAddress(patientAddress);

  useEffect(() => {
    const retrieveRecordInfo = async () => {
      dispatchLoading();
      if (isRecordIdValid()) {
        const record = (
          await getPatientRecord(patientAddress, +patientRecordId)
        )[0];
        setRecord(record);
      }
      dispatchNotLoading();
    };
    retrieveRecordInfo();
  }, [patientAddress, patientRecordId]);

  const secondaryContent = useMemo(
    () => [
      record && getFormattedDate(record),
      `${translate('input-labels.patient-address')}: ${record?.patient}`,
      `${translate('input-labels.doctor-address')}: ${record?.doctor}`,
      `${translate('input-labels.medical-center-address')}: ${
        record?.medicalCenter
      }`,
    ],
    [record, translate]
  );

  if (!isRecordIdValid()) {
    return <NotFound />;
  }
  return (
    <PatientAddressAccess patientRecordAddress={patientAddress}>
      <Card className="detailed-record">
        <CardContent>
          <Typography variant="h4" color="primary">
            {record?.title}
          </Typography>
        </CardContent>
        <CardContent>
          {secondaryContent.map((data) => (
            <Typography key={data} variant="subtitle1" color="primary">
              {data}
            </Typography>
          ))}
        </CardContent>
        <CardContent>
          <Typography variant="body1">{record?.description}</Typography>
        </CardContent>
        {record?.tags && (
          <CardContent>
            <Tags tags={record?.tags} />
          </CardContent>
        )}
        {record?.attachment && (
          <CardActions>
            <FileDownloadButton fileInfo={record.attachment} />
          </CardActions>
        )}
      </Card>
    </PatientAddressAccess>
  );
}
