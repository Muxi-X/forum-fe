import React, { useEffect } from 'react';
import { useOutlet, useLocation } from 'react-router';
import useShowHeader from 'store/useShowHeader';
import styled from 'styled-components';
import { Alert } from 'antd';
import ErrorBoundary from 'components/ErrorBoundary';
import ResultPage from './Result';
import media from 'styles/media';

export const ContentWrapper = styled.main`
  display: flex;
  justify-content: center;
  margin-top: 5.17rem;
`;

export const Content = styled.div`
  width: 60vw;
  max-width: 960px;
  min-width: 375px;
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

const Layout: React.FC = () => {
  const { pathname } = useLocation();
  const children = useOutlet();
  const { setShowHeader } = useShowHeader();

  const isSpecialPage = () => {
    const isLogin = pathname === '/login';
    const isPost = pathname.includes('/editor/article');
    return isLogin || isPost;
  };

  useEffect(() => {
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
      </ErrorBoundary>
    );
  }
};

export default Layout;
