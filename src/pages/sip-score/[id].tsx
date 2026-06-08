import React from 'react';
import { useLocation } from 'react-router-dom';
import SipScoreDetail from 'mobile/pages/SipScoreDetail';
import SipScoreEntryDetail from 'mobile/pages/SipScoreEntryDetail';

const SipScoreRoute = () => {
  const { pathname } = useLocation();

  if (/\/sip-score\/[^/]+\/entry\/[^/]+$/.test(pathname)) {
    return <SipScoreEntryDetail />;
  }

  return <SipScoreDetail />;
};

export default SipScoreRoute;
