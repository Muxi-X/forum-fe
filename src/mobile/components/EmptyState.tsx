import React from 'react';
import styled from 'styled-components';
import { GhostButton, mobilePalette, mobileRadius } from '../styles';

const Box = styled.div<{ $minHeight?: number; $compact?: boolean }>`
  min-height: ${(props) => props.$minHeight || (props.$compact ? 96 : 180)}px;
  display: grid;
  place-items: center;
  padding: ${(props) => (props.$compact ? '22px 16px' : '36px 20px')};
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
  minHeight?: number;
  compact?: boolean;
}> = ({ title = '暂时没有内容', text, actionText, onAction, minHeight, compact }) => (
  <Box $minHeight={minHeight} $compact={compact}>
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
