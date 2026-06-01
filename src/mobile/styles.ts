import styled, { css } from 'styled-components';

export const mobilePalette = {
  bg: '#f9fafc',
  paper: '#ffffff',
  ink: '#1a202c',
  muted: '#7f838a',
  line: '#d8d8d8',
  orange: '#fe9800',
  amber: '#ffc641',
  green: '#70b77e',
  blue: '#4e7fff',
  danger: '#f05d5e',
};

export const safeBottom = css`
  padding-bottom: calc(72px + env(safe-area-inset-bottom));
`;

export const MobilePage = styled.div`
  min-height: 100dvh;
  background: ${mobilePalette.bg};
  color: ${mobilePalette.ink};
  font-size: 14px;
  font-family:
    'Source Han Sans', 'PingFang SC', 'Microsoft YaHei', -apple-system,
    BlinkMacSystemFont, 'Segoe UI', sans-serif;
  * {
    box-sizing: border-box;
  }
  button,
  input,
  textarea {
    font: inherit;
  }
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
  height: 48px;
  border: 0;
  border-radius: 999px;
  padding: 0 20px;
  background: ${mobilePalette.amber};
  color: #fff;
  font-weight: 500;
  cursor: pointer;
  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
`;

export const GhostButton = styled.button`
  height: 38px;
  border: 1px solid ${mobilePalette.line};
  border-radius: 999px;
  background: #fff;
  color: ${mobilePalette.ink};
  padding: 0 14px;
  cursor: pointer;
`;
