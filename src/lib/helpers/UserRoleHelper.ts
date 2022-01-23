import { NavigationOptions } from '../types/NavigationOptions';
import { UserRole } from '../types/UserRole';

export function canWrite(role: UserRole): boolean {
  switch (role) {
    case UserRole.ADMIN:
    case UserRole.DOCTOR:
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
      ];
    case UserRole.DOCTOR:
      return [
        NavigationOptions.VIEW_PERSONAL_DATA,
        NavigationOptions.MANAGE_PATIENT_DATA,
      ];
    case UserRole.PATIENT:
      return [NavigationOptions.VIEW_PERSONAL_DATA];
    case UserRole.GUEST:
    default:
      return [NavigationOptions.REGISTER];
  }
}
