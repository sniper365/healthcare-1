import { UserRole } from '../lib/types/UserRole';
import { selectUserRole, setUserRole } from '../state/appUserRole';
import { useAppDispatch, useAppSelector } from '../state/hooks';
import { useHealthCareApi } from './useHealthCareApi';

export function useUserRole() {
  const dispatch = useAppDispatch();
  const userRole = useAppSelector(selectUserRole);
  const { canWrite, canGiveAccess, isRegistered } = useHealthCareApi();

  const dispatchSetUserRole = (role: UserRole) => {
    dispatch(setUserRole(role));
  };

  const fetchUserRole = async () => {
    const isAdmin = (await canGiveAccess())[0];
    if (isAdmin) {
      dispatchSetUserRole(UserRole.ADMIN);
      return;
    }
    const isEditor = (await canWrite())[0];
    if (isEditor) {
      dispatchSetUserRole(UserRole.DOCTOR);
      return;
    }
    const isPatient = (await isRegistered())[0];
    if (isPatient) {
      dispatchSetUserRole(UserRole.PATIENT);
      return;
    }
    dispatchSetUserRole(UserRole.GUEST);
  };
  return { userRole, fetchUserRole };
}
