import React from 'react';
import styled, { keyframes } from 'styled-components';
import { mobilePalette, mobileRadius } from '../styles';

const spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

const Box = styled.div`
  min-height: 220px;
  display: grid;
  place-items: center;
  padding: 34px 20px;
  color: ${mobilePalette.muted};
`;

const Bubble = styled.div`
  display: grid;
  justify-items: center;
  gap: 12px;
  padding: 22px 26px;
  border-radius: ${mobileRadius.xl};
  background: rgba(255, 255, 255, 0.78);
  box-shadow: 0 12px 32px rgba(16, 24, 40, 0.06);
  backdrop-filter: blur(16px);
`;

const Spinner = styled.span`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 3px solid rgba(254, 152, 0, 0.16);
  border-top-color: ${mobilePalette.orange};
  animation: ${spin} 0.86s linear infinite;
`;

const LoadingState: React.FC<{ text?: string; minHeight?: number }> = ({
  text = '正在加载...',
  minHeight,
}) => (
  <Box style={minHeight ? { minHeight } : undefined}>
    <Bubble>
      <Spinner />
      <span>{text}</span>
    </Bubble>
  </Box>
);

export default LoadingState;
