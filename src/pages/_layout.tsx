import React from 'react';
import { useOutlet, useLocation, useNavigate } from 'react-router';
import styled from 'styled-components';
import Header from 'components/Header/header';
import 'antd/dist/antd.css';

const WelcomePage = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const LayoutPage: React.FC = () => {
  return (
    <>
      <Header />
      {useOutlet()}
    </>
  );
};

const Welcome: React.FC = () => {
  const nav = useNavigate();
  return (
    <WelcomePage>
      <h1>欢迎来到XXX</h1>
      <h3>这里是一个分享经验，互相学习的平台</h3>
      <h3>欢迎大家在这里畅所欲言</h3>
      <button onClick={() => nav(`/login`)}>点我去登录页面</button>
    </WelcomePage>
  );
};

const Layout: React.FC = () => {
  const location = useLocation();

  if (location.pathname.includes('/login') || location.pathname.includes('editor')) {
    return <>{useOutlet()}</>;
  }

  return (
    <>
      <LayoutPage />
    </>
  );
};

export default Layout;
