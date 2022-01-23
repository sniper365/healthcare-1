import { useCallback, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import {
  LockOpen,
  MeetingRoom,
  Person,
  SupervisedUserCircle,
  Home as HomeIcon,
} from '@material-ui/icons';
import {
  AppBar,
  Toolbar,
  Typography,
} from '@material-ui/core';
import { useTranslator } from '../../hooks/useTranslator';
import { getNavigationOptions } from '../../lib/helpers/UserRoleHelper';
import { NavigationOptions } from '../../lib/types/NavigationOptions';
import { NavigationMenuOption } from './NavigationMenuOptions';
import { useAccount } from '../../hooks/useAccount';
import { useUserRole } from '../../hooks/useUserRole';

import { UserInfo } from '../UserInfo/UserInfo';
import './Navigation.css';

export function Navigation() {
  const history = useHistory();
  const { account } = useAccount();
  const { userRole } = useUserRole();
  const { translate } = useTranslator();
  const styles = { 
      background: 'red',
  }

  const onOptionSelected = useCallback(
    (navigateTo: string) => {
      history.push(navigateTo);
    },
    [history]
  );

  const menuOptionsData = useMemo(() => {
    return {
      [NavigationOptions.REGISTER]: {
        label: 'navigation.register',
        onSelect: () => onOptionSelected('/register'),
        icon: <MeetingRoom />,
      },
      [NavigationOptions.VIEW_PERSONAL_DATA]: {
        label: 'navigation.your-data',
        onSelect: () => onOptionSelected(`/patient-records/${account}`),
        icon: <Person />,
      },
      [NavigationOptions.MANAGE_PATIENT_DATA]: {
        label: 'navigation.manage-data',
        onSelect: () => onOptionSelected('/patient-records'),
        icon: <SupervisedUserCircle />,
      },
      [NavigationOptions.GIVE_ACCESS_RIGHTS]: {
        label: 'navigation.give-access',
        onSelect: () => onOptionSelected('/give-access'),
        icon: <LockOpen />,
      },
    };
  }, [account, onOptionSelected]);

  return (
    <div className="navigation-bar">
      <AppBar position="static" style={{background: 'purple', borderRadius:'20px', height:'80px'}} >
        <Toolbar>
          <Typography
            className="navigation-title"
            style={{cursor:'pointer'}}
            variant="h4"
            onClick={() => history.push('/')}
          >
            {translate('navigation.title')}
          </Typography>          

          {getNavigationOptions(userRole).map((key) => (
            <NavigationMenuOption
              key={key}
              label={translate(menuOptionsData[key].label)}
              onSelect={menuOptionsData[key].onSelect}
              icon={menuOptionsData[key].icon}
            />
          ))}

          {/* <NavigationMenu
            anchorElement={anchorElement}
            closeCallback={closeMenu}
          /> */}
          {/* <UserInfo /> */}
        </Toolbar>
      </AppBar>
    </div>
  );
}
