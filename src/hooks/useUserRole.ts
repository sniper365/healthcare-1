import { UserRole } from '../lib/types/UserRole';
import { selectUserRole, setUserRole } from '../state/appUserRole';
import { useAppDispatch, useAppSelector } from '../state/hooks';
import { useHealthCareApi } from './useHealthCareApi';

export function useUserRole() {
  const dispatch = useAppDispatch();
  const userRole = useAppSelector(selectUserRole);
  const { canWrite, canGiveAccess, isRegisteredAsPatient, isRegisteredAsDoctor } = useHealthCareApi();

  const dispatchSetUserRole = (role: UserRole) => {
    dispatch(setUserRole(role));
  };

  const fetchUserRole = async () => {
    const isAdmin = (await canGiveAccess())[0];
    if (isAdmin) {
      dispatchSetUserRole(UserRole.ADMIN);
      return;
    }
    const isRegisteredDoctor = (await isRegisteredAsDoctor())[0];
    if (isRegisteredDoctor) {
      dispatchSetUserRole(UserRole.REGISTERED_DOCTOR);
      return;
    }
    const heCanWrite = (await canWrite())[0];
    if (heCanWrite) {
      dispatchSetUserRole(UserRole.UNREGISTERED_DOCTOR);
      return;
    }
    const isPatient = (await isRegisteredAsPatient())[0];
    if (isPatient) {
      dispatchSetUserRole(UserRole.PATIENT);
      return;
    }
    dispatchSetUserRole(UserRole.GUEST);
  };
  return { userRole, fetchUserRole };
}
