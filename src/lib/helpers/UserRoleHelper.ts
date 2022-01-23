import { NavigationOptions } from '../types/NavigationOptions';
import { UserRole } from '../types/UserRole';

export function canWrite(role: UserRole): boolean {
  switch (role) {
    case UserRole.ADMIN:
    case UserRole.REGISTERED_DOCTOR:
    case UserRole.UNREGISTERED_DOCTOR:
      return true;
  }
  return false;
}

export function getNavigationOptions(role: UserRole): NavigationOptions[] {
  switch (role) {
    case UserRole.ADMIN:
      return [
        NavigationOptions.VIEW_PERSONAL_DATA,
        NavigationOptions.MANAGE_PATIENT_DATA,
        NavigationOptions.GIVE_ACCESS_RIGHTS,
        NavigationOptions.DOCTORS,
      ];
    case UserRole.REGISTERED_DOCTOR:
      return [
        NavigationOptions.VIEW_PERSONAL_DATA,
        NavigationOptions.MANAGE_PATIENT_DATA,
        NavigationOptions.DOCTORS,
      ];
    case UserRole.UNREGISTERED_DOCTOR:
      return [
        NavigationOptions.VIEW_PERSONAL_DATA,
        NavigationOptions.REGISTERASDOCTOR,
        NavigationOptions.DOCTORS,
      ];
    case UserRole.PATIENT:
      return [
        NavigationOptions.VIEW_PERSONAL_DATA,
        NavigationOptions.DOCTORS,
      ];
    case UserRole.GUEST:
    default:
      return [
        NavigationOptions.REGISTER,
        NavigationOptions.DOCTORS,
      ];
  }
}
