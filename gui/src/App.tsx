import { MuiThemeProvider } from '@material-ui/core';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
// import logo from './logo.svg';
import './App.css';
import GoogleSignInSetup from './components/googleSignIn/GoogleSignInSetup';
import MainWindow from './components/MainWindow/MainWindow';
import theme from './theme';

function App() {
  return (
    <div className="App">
      <GoogleSignInSetup>
        <MuiThemeProvider theme={theme}>
          <BrowserRouter>
            <MainWindow />
          </BrowserRouter>
        </MuiThemeProvider>
      </GoogleSignInSetup>
    </div>
  )
}

export default App;
