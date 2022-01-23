import { Typography } from '@material-ui/core';
import { useEffect, useState } from 'react';
import { useAccount } from '../../hooks/useAccount';
import { useTranslator } from '../../hooks/useTranslator';
import { useUserRole } from '../../hooks/useUserRole';
import HealthCareAbi from '../../contracts/HealthCare.json';
import './UserInfo.css';

export function UserInfo() {
  const { account, getBalance } = useAccount();
  const { userRole } = useUserRole();
  const { translate } = useTranslator();
  const [balance, setBalance] = useState<string>();

  const contractAddress = HealthCareAbi.networks['5777'].address;

  useEffect(() => {
    getBalance().then(setBalance);
  }, [account, getBalance]);
  return (
    <div className="user-info">
      <Typography variant="subtitle1">
        {`${translate('user-info.logged-as')} ${translate(
          `user-roles.${userRole}`
        )}`}
      </Typography>
      <Typography variant="subtitle2">
        {`${translate('user-info.account')}: ${account} `}
      </Typography>
      <Typography variant="subtitle2">
        {`${translate('user-info.balance')}: ${balance}`}
      </Typography>
      <Typography variant="subtitle2">
        {`Hospital Center Address: ${contractAddress}`}
      </Typography>
    </div>
  );
}
