import React from 'react';
import { useSearchParams } from 'react-router-dom';
import Main from 'pages/index';
import useDocTitle from 'hooks/useDocTitle';

const Search: React.FC = () => {
  const [getParams] = useSearchParams();
  useDocTitle(`${getParams.get('query')}- 搜索 - 论坛`);
  return <Main></Main>;
};

export default Search;
