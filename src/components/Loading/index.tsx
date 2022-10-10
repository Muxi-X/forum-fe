import React from 'react';
import styled from 'styled-components';
import { Card, Skeleton } from 'antd';

const ContentLoading = styled(Card)`
  width: 100%;
  max-width: 960px;
`;

const Loading: React.FC = () => {
  return (
    <>
      <ContentLoading>
        <Skeleton active />
      </ContentLoading>
    </>
  );
};

export default Loading;
