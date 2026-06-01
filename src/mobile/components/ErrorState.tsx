import React from 'react';
import styled from 'styled-components';
import { GhostButton, mobilePalette } from '../styles';

const Box = styled.div`
  min-height: 220px;
  display: grid;
  place-items: center;
  padding: 36px 20px;
  text-align: center;
  color: ${mobilePalette.muted};
`;

const Inner = styled.div`
  display: grid;
  justify-items: center;
  gap: 14px;
  h3 {
    margin: 0;
    color: ${mobilePalette.ink};
    font-size: 16px;
  }
  p {
    max-width: 260px;
    margin: 0;
    line-height: 1.6;
  }
`;

const ErrorState: React.FC<{
  title?: string;
  text?: string;
  actionText?: string;
  onRetry?: () => void;
}> = ({
  title = '加载失败',
  text = '网络有点不稳定，请稍后再试。',
  actionText = '重试',
  onRetry,
}) => (
  <Box>
    <Inner>
      <h3>{title}</h3>
      <p>{text}</p>
      {onRetry ? <GhostButton onClick={onRetry}>{actionText}</GhostButton> : null}
    </Inner>
  </Box>
);

export default ErrorState;
