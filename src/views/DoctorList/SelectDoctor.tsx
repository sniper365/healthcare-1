import { Paper, Typography } from '@material-ui/core';
import { Search } from '@material-ui/icons';
import { useEffect, useState } from 'react';
import { useHealthCareApi } from '../../hooks/useHealthCareApi';
import { useTranslator } from '../../hooks/useTranslator';
import { DoctorInfo } from '../../lib/types/DoctorInfo';
import { RadioInputField } from '../../components/Inputs/RadioInputField';
import { SearchBar } from '../../components/SearchBar/SearchBar';
import './SelectDoctor.css';
import { VirtualList } from '../../components/VirtualList/VirtualList';
import { DoctorOverview } from './DocterOverview';
import { UserInfo } from '../../components/UserInfo/UserInfo';


const LIST_ITEM_HEIGHT = 76;
const VIRTUAL_LIST_HEIGHT = 450;

enum SearchType {
  BY_NAME = 'name',
  BY_NATIONAL_ID = 'nationalId',
}

const SEARCH_OPTIONS = [
  {
    label: 'input-labels.search-name-radio',
    value: SearchType.BY_NAME,
  },
  {
    label: 'input-labels.search-id-radio',
    value: SearchType.BY_NATIONAL_ID,
  },
];

export function SelectDoctor() {
  const [doctorsInfoCache, setDoctorsInfoCache] = useState<DoctorInfo[]>([]);
  const [doctorsInfoView, setDoctorsInfoView] = useState<DoctorInfo[]>([]);
  const [searchType, setSearchType] = useState<string>(SearchType.BY_NAME);
  const [searched, setSearched] = useState(false);
  const { getDoctorsInfo } = useHealthCareApi();
  const { translate } = useTranslator();

  useEffect(() => {
    const fetchDoctorInfo = async () => {
      const doctorInfo = (await getDoctorsInfo())[0];
      setDoctorsInfoCache(doctorInfo);
    };
    fetchDoctorInfo();
  }, [getDoctorsInfo]);
  
  const searchDoctor = (searchValue: string) => {
    const filteredDoctors = doctorsInfoCache.filter((doctorInfo) =>
    // @ts-ignore
    matchedSearchValue(searchValue, doctorInfo[searchType])
    );
    setDoctorsInfoView(filteredDoctors);
    setSearched(true);
    // setDoctorsInfoCache(filteredDoctors);
  };
  const matchedSearchValue = (searchValue: string, property: string): boolean =>
    property === searchValue || property.includes(searchValue);

  return (
    <div className="select-doctor">
      <Typography
        className="select-doctor-description"
        color="primary"
        variant="h3"
      >
        {translate('view-labels.select-doctor')}
      </Typography>
      <UserInfo/>
      <div className="select-doctor-search">
        <SearchBar
          inputPlaceholder={translate('input-labels.search')}
          buttonLabel={translate('input-labels.search')}
          onSearch={searchDoctor}
          buttonIcon={<Search />}
        />
        <RadioInputField
          options={SEARCH_OPTIONS}
          value={searchType}
          onSelect={setSearchType}
        />
      </div>
      <Paper elevation={2} className="select-doctor-list">
        <VirtualList
          data={searched?doctorsInfoView:doctorsInfoCache}
          mapping={(doctorInfo) => (
            <DoctorOverview key={doctorInfo.id} doctorInfo={doctorInfo} />
          )}
          height={VIRTUAL_LIST_HEIGHT}
          childHeight={LIST_ITEM_HEIGHT}
        />
      </Paper>
    </div>
  );
}
