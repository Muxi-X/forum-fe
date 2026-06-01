import React from 'react';
import styled from 'styled-components';
import { useLocation, useNavigate } from 'react-router-dom';
import useProfile from 'store/useProfile';
import DesignIcon from './DesignIcon';
import { MOBILE_TABLES } from '../constants';
import { mobileMotion, mobilePalette } from '../styles';

const Tabs = styled.nav`
  position: fixed;
  left: 50%;
  bottom: calc(10px + env(safe-area-inset-bottom));
  z-index: 30;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 4px;
  width: min(492px, calc(100% - 28px));
  height: 64px;
  padding: 6px;
  transform: translateX(-50%);
  border: 1px solid rgba(255, 255, 255, 0.76);
  border-radius: 28px;
  background: rgba(255, 255, 255, 0.84);
  box-shadow: 0 12px 34px rgba(16, 24, 40, 0.14);
  backdrop-filter: blur(22px) saturate(180%);
  -webkit-backdrop-filter: blur(22px) saturate(180%);
`;

const Tab = styled.button<{ active: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  min-width: 0;
  border-radius: 22px;
  background: ${(props) =>
    props.active
      ? 'linear-gradient(180deg, rgba(255, 246, 220, 0.98), rgba(255, 232, 164, 0.74))'
      : 'transparent'};
  color: ${(props) => (props.active ? '#1a202c' : '#8a9099')};
  font-size: 12px;
  line-height: 1;
  box-shadow: ${(props) =>
    props.active
      ? 'inset 0 0 0 1px rgba(255, 198, 65, 0.28), 0 8px 18px rgba(255, 198, 65, 0.18)'
      : 'none'};
  transition: color ${mobileMotion.fast}, background ${mobileMotion.fast},
    box-shadow ${mobileMotion.fast}, transform ${mobileMotion.fast};
  &:active {
    transform: scale(0.96);
  }
  span {
    font-weight: ${(props) => (props.active ? 600 : 400)};
  }
  svg {
    transform: ${(props) => (props.active ? 'translateY(-1px)' : 'none')};
    transition: transform ${mobileMotion.fast};
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
  const firstSegment = pathname.split('/').filter(Boolean)[0] || '';
  const isTeaTableRoute = MOBILE_TABLES.some((table) => table.route === firstSegment);

  const items = [
    {
      label: '首页',
      path: '/',
      active: pathname === '/' || pathname === '/search' || isTeaTableRoute,
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
          aria-current={item.active ? 'page' : undefined}
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
