import styled, { css } from 'styled-components';

export const mobilePalette = {
  bg: '#f7f8fb',
  bgWarm: '#fff9ed',
  paper: '#ffffff',
  ink: '#1a202c',
  inkSoft: '#343a46',
  muted: '#7f838a',
  mutedSoft: '#a0a6b2',
  line: '#d8d8d8',
  lineSoft: 'rgba(60, 60, 67, 0.12)',
  orange: '#fe9800',
  amber: '#ffc641',
  green: '#70b77e',
  blue: '#4e7fff',
  danger: '#f05d5e',
  shadow: 'rgba(16, 24, 40, 0.08)',
  shadowWarm: 'rgba(255, 152, 0, 0.22)',
};

export const mobileRadius = {
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '22px',
  pill: '999px',
};

export const mobileMotion = {
  fast: '150ms ease',
  normal: '220ms ease',
  slow: '320ms ease',
};

export const safeBottom = css`
  padding-bottom: calc(72px + env(safe-area-inset-bottom));
`;

export const MobilePage = styled.div`
  min-height: 100dvh;
  background: ${mobilePalette.bg};
  color: ${mobilePalette.ink};
  font-size: 14px;
  font-family: 'Source Han Sans', 'PingFang SC', 'Microsoft YaHei', -apple-system,
    BlinkMacSystemFont, 'Segoe UI', sans-serif;
  * {
    box-sizing: border-box;
  }
  button,
  input,
  textarea {
    font: inherit;
  }
  button {
    border: 0;
    -webkit-tap-highlight-color: transparent;
  }
  img {
    max-width: 100%;
  }
`;

export const ScrollBody = styled.main<{ withTabs?: boolean }>`
  min-height: 100dvh;
  ${(props) => (props.withTabs ? safeBottom : '')}
`;

export const Section = styled.section`
  background: ${mobilePalette.paper};
  border-top: 1px solid ${mobilePalette.line};
  border-bottom: 1px solid ${mobilePalette.line};
`;

export const CardSurface = styled.article`
  background: ${mobilePalette.paper};
  border: 1px solid ${mobilePalette.lineSoft};
  border-radius: ${mobileRadius.lg};
  box-shadow: 0 10px 30px ${mobilePalette.shadow};
`;

export const PrimaryButton = styled.button`
  height: 48px;
  border: 0;
  border-radius: ${mobileRadius.pill};
  padding: 0 20px;
  background: linear-gradient(135deg, ${mobilePalette.amber}, ${mobilePalette.orange});
  color: #fff;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 12px 24px ${mobilePalette.shadowWarm};
  transition: transform ${mobileMotion.fast}, opacity ${mobileMotion.fast},
    box-shadow ${mobileMotion.fast};
  &:active {
    transform: scale(0.98);
  }
  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
    box-shadow: none;
  }
`;

export const GhostButton = styled.button`
  height: 38px;
  border: 1px solid ${mobilePalette.lineSoft};
  border-radius: ${mobileRadius.pill};
  background: #fff;
  color: ${mobilePalette.ink};
  padding: 0 14px;
  cursor: pointer;
  transition: background ${mobileMotion.fast}, transform ${mobileMotion.fast};
  &:active {
    transform: scale(0.98);
    background: rgba(60, 60, 67, 0.06);
  }
`;
