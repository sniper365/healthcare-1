import { SnackbarProvider } from 'notistack';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Web3ReactProvider } from '@web3-react/core';
import { JsonRpcProvider } from '@ethersproject/providers';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import purple from '@material-ui/core/colors/purple';
import green from '@material-ui/core/colors/green';
import { App } from './App';
import { store } from './state/store';
import { appEnv } from './state/env';
import * as serviceWorker from './serviceWorker';

function getLibrary(): JsonRpcProvider {
  const providerUrl = appEnv().mandatory.jsonRpcProviderUrl;
  return new JsonRpcProvider(providerUrl);
}

const THEME = createMuiTheme({
  typography: {
    fontFamily: `Varela Round`,
    fontSize: 14,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 700,
  },
  palette: {
    primary: {
      main: purple[600],
    },
    secondary: {
      main: green[500],
    },
  },
});

ReactDOM.render(
  <React.StrictMode>
    <Web3ReactProvider getLibrary={getLibrary}>
      <ThemeProvider theme={THEME}>
        <Provider store={store}>
          <SnackbarProvider
            maxSnack={5}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          >
            <App />
          </SnackbarProvider>
        </Provider>
      </ThemeProvider>
    </Web3ReactProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
