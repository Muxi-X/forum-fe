import React from 'react';
import { Card } from 'antd';
import styled from 'styled-components';

const Wrapper = styled(Card)`
  height: 100%;
`;

const EmptyCard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <Wrapper>{children}</Wrapper>;
};

export default EmptyCard;
