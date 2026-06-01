import React from 'react';
import styled from 'styled-components';
import { useLocation, useNavigate } from 'react-router-dom';
import useProfile from 'store/useProfile';
import DesignIcon from './DesignIcon';
import { mobilePalette } from '../styles';

const Tabs = styled.nav`
  position: fixed;
  width: 100%;
  max-width: 520px;
  left: 0;
  right: 0;
  margin: 0 auto;
  bottom: 0;
  z-index: 30;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  height: calc(68px + env(safe-area-inset-bottom));
  padding-bottom: env(safe-area-inset-bottom);
  background: rgba(255, 255, 255, 0.92);
  border-top: 1px solid rgba(60, 60, 67, 0.14);
  box-shadow: 0 -8px 24px rgba(16, 24, 40, 0.06);
  backdrop-filter: blur(18px);
`;

const Tab = styled.button<{ active: boolean }>`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
  background: transparent;
  color: ${(props) => (props.active ? '#1a202c' : '#8a9099')};
  font-size: 12px;
  line-height: 1;
  transition: color 0.18s ease, transform 0.18s ease;
  &:active {
    transform: scale(0.96);
  }
  &::before {
    content: '';
    position: absolute;
    top: 7px;
    width: 42px;
    height: 30px;
    border-radius: 999px;
    background: ${(props) => (props.active ? 'rgba(255, 198, 65, 0.18)' : 'transparent')};
  }
  span {
    position: relative;
    font-weight: ${(props) => (props.active ? 600 : 400)};
  }
  svg {
    position: relative;
    transform: ${(props) => (props.active ? 'translateY(-1px)' : 'none')};
  }
  svg [stroke] {
    stroke: ${(props) => (props.active ? mobilePalette.ink : undefined)};
  }
`;

const MobileBottomTabs: React.FC = () => {
  const nav = useNavigate();
  const { pathname } = useLocation();
  const {
    userProfile: { id },
  } = useProfile();
  const me = id || Number(localStorage.getItem('userId')) || 0;
  const viewingUserId = pathname.match(/^\/user\/(\d+)$/)?.[1];

  const items = [
    {
      label: '首页',
      path: '/',
      active:
        pathname === '/' ||
        pathname === '/search' ||
        (/^\/[a-zA-Z0-9_-]+$/.test(pathname) && !pathname.startsWith('/user')),
      icon: 'home' as const,
    },
    {
      label: '茶评',
      path: '/sip-score',
      active: pathname.startsWith('/sip-score'),
      icon: 'teaReview' as const,
    },
    {
      label: '我的',
      path: `/user/${me || ''}`,
      active: Boolean(me && viewingUserId && Number(viewingUserId) === Number(me)),
      icon: 'user' as const,
    },
  ];

  return (
    <Tabs>
      {items.map((item) => (
        <Tab
          key={item.label}
          type="button"
          active={item.active}
          onClick={() => nav(item.path)}
        >
          <DesignIcon name={item.icon} active={item.active} size={25} />
          <span>{item.label}</span>
        </Tab>
      ))}
    </Tabs>
  );
};

export default MobileBottomTabs;
