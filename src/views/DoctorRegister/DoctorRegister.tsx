import { Button, Paper } from '@material-ui/core';
import { useState } from 'react';
import { useAppLoading } from '../../hooks/useAppLoading';
import { useHealthCareApi } from '../../hooks/useHealthCareApi';
import { useHistory } from 'react-router-dom';
import { useAccount } from '../../hooks/useAccount';
import { TextInputField } from '../../components/Inputs/TextInputField';
import { NumberInputField } from '../../components/Inputs/NumberInputField';
import { useNotifications } from '../../hooks/useNotifications';
import { UserInfo } from '../../components/UserInfo/UserInfo';

import './DoctorRegister.css';
import { useTranslator } from '../../hooks/useTranslator';

interface DoctorRegisterProps {
  onRegister: () => void;
}

export function DoctorRegister(props: DoctorRegisterProps) {

  const { registerAsDoctor } = useHealthCareApi();
  const { dispatchLoading, dispatchNotLoading } = useAppLoading();
  const { account } = useAccount();
  const { translate } = useTranslator();
  const history = useHistory();
  const { pushSuccessNotification, pushErrorNotification } = useNotifications();
  const [name, setName] = useState('');
  const [nationalId, setNationalId] = useState('');
  const [gender, setGender] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [yearsOfExperience, setYearsOfExperience] = useState(0);

  const register = async () => {
    dispatchLoading();
    try {
      await registerAsDoctor(
        account as string,
        name,
        nationalId,
        gender,
        specialty,
        yearsOfExperience
      );
      props.onRegister();
      history.push('/');
      pushSuccessNotification('notifications.register-success');
    } catch (err) {
      pushErrorNotification('notifications.register-error');
    } finally {
      dispatchNotLoading();
      history.push(`/doctors`);
    }
  };
  const isValid = () => {
    return name.trim() && nationalId.trim() && gender.trim();
  };
  return (
    <>
      <UserInfo />
      <Paper elevation={2} className="register-form">
        <form onSubmit={(e) => e.preventDefault()}>
          <TextInputField
            className="register-form-item"
            placeholder={translate('input-labels.patient-address')}
            value={account as string}
            address
            disabled
          />
          <TextInputField
            className="register-form-item"
            placeholder={translate('input-labels.doctor-name')}
            value={name}
            onChange={setName}
            required
          />
          <TextInputField
            className="register-form-item"
            placeholder={translate('input-labels.national-id')}
            value={nationalId}
            onChange={setNationalId}
            required
          />
          <TextInputField
            className="register-form-item"
            placeholder={translate('input-labels.doctor-gender')}
            value={gender}
            onChange={setGender}
            required
          />
          <TextInputField
            className="register-form-item"
            placeholder={translate('input-labels.doctor-specialty')}
            value={specialty}
            onChange={setSpecialty}
            required
          />
          <NumberInputField
            className="register-form-item"
            placeholder={translate('input-labels.doctor-yearsOfExperience')}
            type="number"
            value={yearsOfExperience}
            onChange={setYearsOfExperience}
            required
          />
          <div className="register-form-item register-form-submit-button-wrapper">
            <Button
              type="submit"
              className="register-form-submit-button"
              variant="contained"
              color="primary"
              onClick={register}
              disabled={!isValid()}
            >
              {translate('input-labels.register-button')}
            </Button>
          </div>
        </form>
      </Paper>
    </>
  );
}
