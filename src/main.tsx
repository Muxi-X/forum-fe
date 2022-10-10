import React from 'react';
import ReactDOM from 'react-dom/client';
import SetRoutes from 'router';
import GlobalStyle from '../src/styles/global';
import { PontCore } from 'services/pontCore';
import Request from 'utils/fetchMiddleware';
import API from 'services/mods/index.js';

PontCore.useFetch(Request);
window.API = API;

ReactDOM.createRoot(document.getElementById('root')!).render(
  <>
    <GlobalStyle />
    <SetRoutes />
  </>,
);
