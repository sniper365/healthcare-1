import { isAddress } from '@ethersproject/address';
import { Card, CardActions, CardContent, Typography } from '@material-ui/core';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAppLoading } from '../../hooks/useAppLoading';
import { useHealthCareApi } from '../../hooks/useHealthCareApi';
import { useTranslator } from '../../hooks/useTranslator';
import { getFormattedDate, getFormattedDateofDoctor } from '../../lib/helpers/DateHelper';
import { DoctorRecord } from '../../lib/types/DoctorRecord';
import { NotFound } from '../../components/NotFound/NotFound';
import { DoctorAddressAccess } from '../../components/DoctorAddressAccess/DoctorAddressAccess';
import { FileDownloadButton } from '../../components/Inputs/FileDownloadButton';
import { Tags } from './Tags';
import './DetailedInfo.css';

export function DetailedInfo() {
  const { getDoctorRecord } = useHealthCareApi();
  const { doctorAddress} =
    useParams<{ doctorAddress: string }>();
  const [record, setRecord] = useState<DoctorRecord>();
  const { dispatchLoading, dispatchNotLoading } = useAppLoading();
  const { translate } = useTranslator();


  useEffect(() => {
    const retrieveRecordInfo = async () => {
      dispatchLoading();
        const record = (
          await getDoctorRecord(doctorAddress)
        )[0];
        setRecord(record);
      dispatchNotLoading();
    };
    retrieveRecordInfo();
  }, [doctorAddress]);

  const secondaryContent = useMemo(
    () => [
      record && getFormattedDateofDoctor(record),
      `${translate('input-labels.doctor-address')}: ${record?.name}`,
      `${translate('input-labels.doctor-address')}: ${record?.gender}`,
      `${translate('input-labels.doctor-address')}: ${record?.specialty}`,
      `${translate('input-labels.doctor-address')}: ${record?.yearsOfExperience.toString()}`,
    ],
    [record, translate]
  );

  return (
    <DoctorAddressAccess doctorRecordAddress={doctorAddress}>
      <Card className="detailed-record">
        <CardContent>
          <Typography variant="h4" color="primary">
            {`Name: ${record?.name}`}
          </Typography>
        </CardContent>
        <CardContent>
          <Typography variant="h4" color="primary">
            {`Gender: ${record?.gender}`}
          </Typography>
        </CardContent>
        <CardContent>
          <Typography variant="h4" color="primary">
            {`Specialty: ${record?.specialty}`}
          </Typography>
        </CardContent>
        <CardContent>
          <Typography variant="h4" color="primary">
            {`Years of Experience: ${record?.yearsOfExperience.toString()}`}
          </Typography>
        </CardContent>
      </Card>
    </DoctorAddressAccess>
  );
}
