import React from 'react';
import styled from 'styled-components';
import { mobilePalette } from '../styles';

const Box = styled.div`
  padding: 44px 20px;
  text-align: center;
  color: ${mobilePalette.muted};
`;

const EmptyState: React.FC<{ text?: string }> = ({ text = '暂时没有内容' }) => (
  <Box>{text}</Box>
);

export default EmptyState;
