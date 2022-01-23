import { isAddress } from '@ethersproject/address';
import { Button, Paper, Typography } from '@material-ui/core';
import { Delete, FilterList } from '@material-ui/icons';
import { useEffect, useState } from 'react';
import { useAppLoading } from '../../hooks/useAppLoading';
import { useHealthCareApi } from '../../hooks/useHealthCareApi';
import { useTranslator } from '../../hooks/useTranslator';
import { PatientRecord } from '../../lib/types/PatientRecord';
import { useParams } from 'react-router-dom';
import { PatientAddressAccess } from '../../components/PatientAddressAccess/PatientAddressAccess';
import { SearchBar } from '../../components/SearchBar/SearchBar';
import { VirtualList } from '../../components/VirtualList/VirtualList';
import { RecordOverview } from './RecordOverview';
import { UserInfo } from '../../components/UserInfo/UserInfo';

import './RecordList.css';
// import { userInfo } from 'os';

const LIST_ITEM_HEIGHT = 72;
const VIRTUAL_LIST_HEIGHT = 500;

export function RecordList() {
  const { getPatientRecords } = useHealthCareApi();
  const [patientRecordsCache, setPatientRecordsCache] = useState<
    PatientRecord[]
  >([]);
  const [patientRecordsView, setPatientRecordsView] = useState<PatientRecord[]>(
    []
  );
  const { patientAddress } = useParams<{ patientAddress: string }>();
  const { dispatchLoading, dispatchNotLoading } = useAppLoading();
  const { translate } = useTranslator();

  useEffect(() => {
    const retrievePatientRecords = async () => {
      dispatchLoading();
      const resultArray = await getPatientRecords(patientAddress);
      setPatientRecordsCache(resultArray[0]);
      setPatientRecordsView(resultArray[0]);
      dispatchNotLoading();
    };
    if (isAddress(patientAddress)) {
      retrievePatientRecords();
    }
  }, [patientAddress]);

  const searchRecord = (searchValue: string) => {
    const filteredRecords = patientRecordsCache.filter((record) =>
      record.tags.some(
        (tag) => tag === searchValue || tag.includes(searchValue)
      )
    );
    setPatientRecordsView(filteredRecords);
  };

  const isViewFiltered = () =>
    patientRecordsCache.length !== patientRecordsView.length;

  return (
    <PatientAddressAccess patientRecordAddress={patientAddress}>
      <div className="record-list">
        <div className="record-title">
          <Typography variant="h3" color="primary">
            {translate('view-labels.my-record')}
          </Typography>
          {/* <UserInfo/> */}
        </div>
        <div className="record-list-search">
          <SearchBar
            inputPlaceholder={translate('input-labels.search-tags')}
            buttonLabel={translate('input-labels.filter-button')}
            onSearch={searchRecord}
            buttonIcon={<FilterList />}
          />
          <Button
            endIcon={<Delete />}
            color="secondary"
            style={{
              visibility: isViewFiltered() ? 'visible' : 'hidden',
            }}
            onClick={() => setPatientRecordsView(patientRecordsCache)}
          >
            {translate('input-labels.clear-filter-button')}
          </Button>
        </div>
        <Paper elevation={2}>
          <VirtualList
            childHeight={LIST_ITEM_HEIGHT}
            height={VIRTUAL_LIST_HEIGHT}
            data={patientRecordsView}
            mapping={(r) => <RecordOverview key={r.id} patientRecord={r} />}
            onEmptyList={<NoRecordsFound />}
          />
        </Paper>
      </div>
    </PatientAddressAccess>
  );
}

function NoRecordsFound() {
  const { translate } = useTranslator();
  return (
    <Paper elevation={2} className="no-records-found">
      <Typography variant="subtitle1" color="secondary">
        {translate('view-labels.no-records')}
      </Typography>
    </Paper>
  );
}
