import { useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import { InjectedConnector } from '@web3-react/injected-connector';
import { JsonRpcProvider } from '@ethersproject/providers';
import CssBaseline from '@material-ui/core/CssBaseline';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { useNotifications } from './hooks/useNotifications';
import { appEnv } from './state/env';
import { BackdropSpinner } from './components/BackdropSpinner/BackdropSpinner';
import { useAppLoading } from './hooks/useAppLoading';
import { Router } from './Router';
import { Typography } from '@material-ui/core';
import { NotFound } from './components/NotFound/NotFound';

export function App() {
  const { account, active, activate, error } = useWeb3React<JsonRpcProvider>();
  const { isAppLoading } = useAppLoading();
  const { pushErrorNotification } = useNotifications();
  const [light, setLight] = useState(true);

  const themeLight = createMuiTheme({
    palette: {
      background: {
        paper: '#6910a8'
      },
      primary: {
        main: '#f7ebfd',
      },
      text: {
        primary: '#f7ebfd',
        secondary: '#6910a8'
      },
    },
    shape: {
      borderRadius: 40,
    },
  });

  const themeDark = createMuiTheme({
    palette: {
      background: {
      },
      primary: {
        main: '#6910a8',
      },
      text: {
        primary: '#6910a8',
        secondary: '#f7ebfd' 
      },
    },
    shape: {
      borderRadius: 40,
    },
  });

  useEffect(() => {
    const activateConnector = async () => {
      const injectedConnector = new InjectedConnector({
        supportedChainIds: [appEnv().mandatory.chainId],
      });
      if (!active) {
        await activate(injectedConnector);
      }
      if (error) {
        console.error(error);
      }
    };
    activateConnector();
  }, [account, active, activate, error]);

  if (!active) {
    return (
      <>
        <NotFound />
        <Typography
          variant="h3"
          color="primary"
          style={{ textAlign: 'center' }}
        >
          Check Your Net... It must be Localhost.
        </Typography>
      </>
    );
  }
  return (
    <>
      <MuiThemeProvider theme={light ? themeLight : themeDark}>
        <CssBaseline />
        <Typography
          onClick={() => setLight((prev) => !prev)}
          style={{ cursor: 'pointer' }}
        >
          {light ? 'DARK' : 'LIGHT'}
        </Typography>
        <Router />
        <BackdropSpinner opened={isAppLoading} />
      </MuiThemeProvider>
    </>
  );
}
