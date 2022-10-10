import React from 'react';
import Result from './Result';
import { Content } from './_layout';

const NotFount: React.FC = () => {
  return (
    <Content>
      <Result type="404" />
    </Content>
  );
};

export default NotFount;
