import React from 'react';
import styled from 'styled-components';
import { GhostButton, mobilePalette, mobileRadius } from '../styles';

const Box = styled.div`
  min-height: 180px;
  display: grid;
  place-items: center;
  padding: 36px 20px;
  text-align: center;
  color: ${mobilePalette.muted};
`;

const Inner = styled.div`
  display: grid;
  justify-items: center;
  gap: 12px;
  .mark {
    width: 48px;
    height: 48px;
    display: grid;
    place-items: center;
    border-radius: ${mobileRadius.lg};
    background: rgba(255, 198, 65, 0.18);
    color: ${mobilePalette.orange};
    font-weight: 800;
  }
  h3 {
    margin: 0;
    color: ${mobilePalette.ink};
    font-size: 15px;
  }
  p {
    max-width: 260px;
    margin: 0;
    line-height: 1.6;
  }
`;

const EmptyState: React.FC<{
  title?: string;
  text?: string;
  actionText?: string;
  onAction?: () => void;
}> = ({ title = '暂时没有内容', text, actionText, onAction }) => (
  <Box>
    <Inner>
      <span className="mark">茶</span>
      <h3>{title}</h3>
      {text ? <p>{text}</p> : null}
      {actionText && onAction ? (
        <GhostButton onClick={onAction}>{actionText}</GhostButton>
      ) : null}
    </Inner>
  </Box>
);

export default EmptyState;
