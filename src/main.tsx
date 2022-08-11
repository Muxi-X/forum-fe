import React from 'react';
import ReactDOM from 'react-dom/client';
import SetRoutes from 'router';
import GlobalStyle from '../src/styles/global';
import API from 'services/mods/index';
import { SWRProvider } from 'services/hooks';
import { PontCore } from 'services/pontCore';
import Request from 'services/fetchMiddleware';

window.API = API;
PontCore.useFetch(Request);
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <SWRProvider>
      <GlobalStyle />
      <SetRoutes />
    </SWRProvider>
  </React.StrictMode>,
);
