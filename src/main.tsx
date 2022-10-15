import React from 'react';
import ReactDOM from 'react-dom/client';
import App from 'router';
import GlobalStyle from '../src/styles/global';
import { PontCore } from 'services/pontCore';
import Request from 'utils/fetchMiddleware';
import API from 'services/mods/index.js';
import 'antd/dist/antd.less';

PontCore.useFetch(Request);
window.API = API;

ReactDOM.createRoot(document.getElementById('root')!).render(
  <>
    <GlobalStyle />
    <App />
  </>,
);
