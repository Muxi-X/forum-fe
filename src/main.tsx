import React from 'react';
import ReactDOM from 'react-dom/client';
import SetRoutes from 'router';
import GlobalStyle from '../src/styles/global';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <GlobalStyle />
    <SetRoutes />
  </React.StrictMode>,
);
