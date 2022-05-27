import * as React from 'react';
import { createRoot } from 'react-dom/client';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import App from './App';
import theme from './theme';
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ResponsiveAppBar from './Navigation';
import { MetamaskAccountContext } from './utils/Context';
import Inventory from './Inventory';
import { Container } from '@mui/system';
import Forge from './Forge';

const rootElement = document.getElementById('root')!;
const root = ReactDOM.createRoot(
  rootElement
);


export default function MainBootstrap() {
  const [metamaskAccount, setMetamaskAccount] = React.useState(false);

  return (
    <MetamaskAccountContext.Provider value={{ metamaskAccount: metamaskAccount, setMetamaskAccount: setMetamaskAccount }}>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
          <CssBaseline />
          <ResponsiveAppBar />
          <div style={{backgroundColor: "#969696", height: "100%", width: "100%",left: 0, position: 'fixed'}}>
          <Container maxWidth="lg">
            <Routes>
              <Route path="/" element={<App />} />
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/forge" element={<Forge etherAddress={metamaskAccount} />} />
            </Routes>
          </Container>
          </div>
        </ThemeProvider>
      </BrowserRouter>
    </MetamaskAccountContext.Provider>
  );
}

root.render(
  <MainBootstrap />
);
