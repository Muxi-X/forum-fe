import React from 'react';
import { useOutlet, useLocation, useNavigate } from 'react-router';
import styled from 'styled-components';
import Header from 'components/Header/header';
import Card from 'components/Card/card';
import { w } from 'styles/global';
import 'antd/dist/antd.css';

const WelcomePage = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const ContentCard = styled(Card)`
  margin-top: 10vh;
  ${w}
`;

const LayoutPage: React.FC = () => {
  return (
    <>
      <Header />
      <ContentCard>{useOutlet()}</ContentCard>
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
  const children = useOutlet();

  const isSpecialLayout = () => {
    const specialRoute = ['/login', '/editor'];

    for (const route of specialRoute) {
      if (location.pathname.includes(route)) return true;
    }
    return false;
  };

  if (isSpecialLayout()) return <>{children}</>;
  else if (location.pathname.includes('/chat')) {
    return (
      <>
        <Header />
        {children}
      </>
    );
  } else {
    return (
      <>
        <LayoutPage />
      </>
    );
  }
};

export default Layout;
