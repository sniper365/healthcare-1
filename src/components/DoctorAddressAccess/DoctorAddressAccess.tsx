import { isAddress } from '@ethersproject/address';
import { ReactChild } from 'react';
import { Redirect } from 'react-router-dom';
import { useAccount } from '../../hooks/useAccount';
import { useUserRole } from '../../hooks/useUserRole';
import { canWrite } from '../../lib/helpers/UserRoleHelper';
import { NotFound } from '../NotFound/NotFound';

interface DoctorAddressAccessProps {
  doctorRecordAddress: string;
  redirectPath?: string;
  children: ReactChild;
}

export function DoctorAddressAccess(props: DoctorAddressAccessProps) {
  const { account } = useAccount();
  const { userRole } = useUserRole();

  const allowsRecordView = (doctorRecordAddress: string) =>
    account === doctorRecordAddress || canWrite(userRole);

  // if (!isAddress(props.doctorRecordAddress)) {
  //   return <NotFound />;
  // }
  // if (!allowsRecordView(props.doctorRecordAddress)) {
  //   return <Redirect to={props.redirectPath || '/'} />;
  // }
  return <>{props.children}</>;
}
