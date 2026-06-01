import React from 'react';
import styled from 'styled-components';
import {
  HomeOutlined,
  HomeFilled,
  TrophyOutlined,
  TrophyFilled,
  UserOutlined,
} from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import { mobilePalette } from '../styles';
import useProfile from 'store/useProfile';

const Tabs = styled.nav`
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 30;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  height: calc(64px + env(safe-area-inset-bottom));
  padding-bottom: env(safe-area-inset-bottom);
  background: rgba(255, 254, 250, 0.98);
  border-top: 1px solid ${mobilePalette.line};
  box-shadow: 0 -8px 24px rgba(31, 35, 41, 0.06);
`;

const Tab = styled.button<{ active: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  background: transparent;
  color: ${(props) => (props.active ? mobilePalette.ink : '#98a0aa')};
  font-size: 12px;
  line-height: 1;
  .anticon {
    color: ${(props) => (props.active ? mobilePalette.orange : '#98a0aa')};
    font-size: 22px;
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
        pathname === '/' || pathname === '/search' || pathname.split('/').length === 2,
      icon: pathname === '/' ? <HomeFilled /> : <HomeOutlined />,
    },
    {
      label: '茶评',
      path: '/sip-score',
      active: pathname.startsWith('/sip-score'),
      icon: pathname.startsWith('/sip-score') ? <TrophyFilled /> : <TrophyOutlined />,
    },
    {
      label: '我的',
      path: `/user/${me || ''}`,
      active: pathname.startsWith('/user'),
      icon: <UserOutlined />,
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
          {item.icon}
          <span>{item.label}</span>
        </Tab>
      ))}
    </Tabs>
  );
};

export default MobileBottomTabs;
