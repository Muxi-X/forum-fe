import React from 'react';
import useDocTitle from 'hooks/useDocTitle';
import Result from './Result';
import { Content, ContentWrapper } from './_layout';

const NotFount: React.FC = () => {
  useDocTitle('页面不存在');
  return (
    <ContentWrapper>
      <Content>
        <Result type="404" />
      </Content>
    </ContentWrapper>
  );
};

export default NotFount;
