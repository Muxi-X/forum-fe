import React from 'react';
import { useSearchParams } from 'react-router-dom';
import Main from 'pages/index';
import useDocTitle from 'hooks/useDocTitle';
import { useDeviceType } from 'hooks/useDeviceType';
import MobileHome from 'mobile/pages/Home';

const Search: React.FC = () => {
  const [getParams] = useSearchParams();
  useDocTitle(`${getParams.get('query')}- 搜索 - 茶馆`);
  if (useDeviceType() === 'phone') return <MobileHome />;
  return <Main></Main>;
};

export default Search;
