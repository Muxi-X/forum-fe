import styled, { css } from 'styled-components';

export const mobilePalette = {
  bg: '#f6f7f9',
  paper: '#fffefa',
  ink: '#252b36',
  muted: '#858b96',
  line: '#eceef2',
  orange: '#ff9f1a',
  amber: '#ffd66e',
  green: '#70b77e',
  blue: '#4e7fff',
  danger: '#f05d5e',
};

export const safeBottom = css`
  padding-bottom: calc(72px + env(safe-area-inset-bottom));
`;

export const MobilePage = styled.div`
  min-height: 100vh;
  background: ${mobilePalette.bg};
  color: ${mobilePalette.ink};
  font-size: 14px;
`;

export const ScrollBody = styled.main<{ withTabs?: boolean }>`
  min-height: 100vh;
  ${(props) => (props.withTabs ? safeBottom : '')}
`;

export const Section = styled.section`
  background: ${mobilePalette.paper};
  border-top: 1px solid ${mobilePalette.line};
  border-bottom: 1px solid ${mobilePalette.line};
`;

export const CardSurface = styled.article`
  background: ${mobilePalette.paper};
  border: 1px solid ${mobilePalette.line};
  border-radius: 8px;
`;

export const PrimaryButton = styled.button`
  height: 42px;
  border: 0;
  border-radius: 8px;
  padding: 0 16px;
  background: ${mobilePalette.orange};
  color: #fff;
  font-weight: 700;
  cursor: pointer;
  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
`;

export const GhostButton = styled.button`
  height: 38px;
  border: 1px solid ${mobilePalette.line};
  border-radius: 8px;
  background: #fff;
  color: ${mobilePalette.ink};
  padding: 0 14px;
  cursor: pointer;
`;
