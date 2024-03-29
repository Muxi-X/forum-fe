import React from 'react';
import { useParams } from 'react-router';
import { CATEGORY_EN } from 'config';
import ResultPage from 'pages/Result';
import Main from 'pages/index';

const Category: React.FC = () => {
  const params = useParams();
  if (!CATEGORY_EN.includes(params.category as string) && params.category !== 'muxi')
    return <ResultPage type="404" />;
  return <Main></Main>;
};

export default Category;
