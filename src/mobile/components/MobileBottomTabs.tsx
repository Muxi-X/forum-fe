import React from 'react';
import styled from 'styled-components';
import { useLocation, useNavigate } from 'react-router-dom';
import useProfile from 'store/useProfile';
import DesignIcon from './DesignIcon';

const Tabs = styled.nav`
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 30;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  height: calc(66px + env(safe-area-inset-bottom));
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
  span {
    font-weight: ${(props) => (props.active ? 600 : 400)};
  }
  svg {
    transform: ${(props) => (props.active ? 'translateY(-1px)' : 'none')};
  }
`;

const MobileBottomTabs: React.FC = () => {
  const nav = useNavigate();
  const { pathname } = useLocation();
  const {
    userProfile: { id },
  } = useProfile();
  const me = id || Number(localStorage.getItem('userId')) || 0;

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
      active: pathname.startsWith('/user'),
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
