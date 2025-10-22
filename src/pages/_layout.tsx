import React, { useEffect } from 'react';
import { useOutlet, useLocation } from 'react-router';
import useShowHeader from 'store/useShowHeader';
import WS, { MsgResponse } from 'utils/WS';
import useWS from 'store/useWS';
import styled from 'styled-components';
import { Alert } from 'antd';
import ErrorBoundary from 'components/ErrorBoundary';
import Footer from 'components/Footer';
import ResultPage from './Result';
import media from 'styles/media';
import useChat from 'store/useChat';

export const ContentWrapper = styled.main`
  display: flex;
  justify-content: center;
  margin-top: 5.17rem;
`;

export const Content = styled.div`
  width: 60vw;
  max-width: 960px;
  min-width: 375px;
  min-height: 73vh;
  ${media.desktop`width: 100vw`}
`;

const ErrorInfo = ({ error }: { error: Error | null }) => (
  <ContentWrapper>
    <Content>
      <ResultPage type="500" />

      <Alert message="Error" description={error?.message} type="error" showIcon />
    </Content>
  </ContentWrapper>
);

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { pathname } = useLocation();
  const { setShowHeader } = useShowHeader();

  const isSpecialPage = () => {
    const isLogin = pathname === '/login';
    const isPost = pathname.includes('/editor');
    return isLogin || isPost;
  };
  const { setTip, setWS, ws } = useWS();
  const { setSelectedId } = useChat();
  const { showHeader } = useShowHeader();

  const webSocketInit = () => {
    const token = localStorage.getItem('token') as string;
    const WebSocket = new WS(token);
    if (WebSocket.ws) {
      WebSocket.ws.onmessage = (res) => {
        console.log(res.data);
        const data: MsgResponse = JSON.parse(res.data);
        if (typeof data?.sender === 'number') {
          setTip(true);
          setSelectedId(data.sender);
        }
      };
    }
    setWS(WebSocket);
  };

  useEffect(() => {
    if (!ws) {
      webSocketInit();
    }
    if (isSpecialPage()) {
      setShowHeader(false);
    } else {
      setShowHeader(true);
    }
  }, [pathname]);
  if (isSpecialPage())
    return <ErrorBoundary fallbackRender={ErrorInfo}>{children}</ErrorBoundary>;
  else {
    return (
      <ErrorBoundary fallbackRender={ErrorInfo}>
        <ContentWrapper>
          <Content>{children}</Content>
        </ContentWrapper>
        {showHeader ? <Footer /> : null}
      </ErrorBoundary>
    );
  }
};

export default Layout;
