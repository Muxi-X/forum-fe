import React, { Suspense, useEffect } from 'react';
import { BrowserRouter as Router, useRoutes } from 'react-router-dom';
import routes from '~react-pages';
import useRequest from 'hooks/useRequest';
import Header from 'components/Header/header';
import useProfile from 'store/useProfile';
import useShowHeader from 'store/useShowHeader';
import useWS from 'store/useWS';
import Layout, { Content, ContentWrapper } from 'pages/_layout';
import Loading from 'components/Loading';
import GlobalNotificationListener from 'components/Notice';

const Routes = () => {
  return (
    <Layout>
      <Suspense
        fallback={
          <ContentWrapper>
            <Content>
              <Loading />
            </Content>
          </ContentWrapper>
        }
      >
        {useRoutes(routes)}
      </Suspense>
    </Layout>
  );
};

const SetRoutes = () => {
  const { showHeader } = useShowHeader();

  return (
    <Router>
      {showHeader ? <Header /> : null}
      <GlobalNotificationListener />
      <Routes />
    </Router>
  );
};

const App = () => {
  const { location } = window;

  const { setUser, setToken } = useProfile();

  const { run: getUser } = useRequest(API.user.getUserMyprofile.request, {
    onSuccess: (res) => {
      setUser(res.data);
    },
    manual: true,
    refreshDeps: [],
  });
  const { ws } = useWS();
  const { run: getQiniuToken } = useRequest(API.post.getPostQiniu_token.request, {
    onSuccess: (res) => {
      setToken(res.data.token as string);
    },
    manual: true,
    refreshDeps: [],
  });

  useEffect(() => {
    if (location.pathname.includes('login')) {
      return;
    } else {
      getUser({});
      getQiniuToken({});
    }
    return () => {
      ws?.close();
    };
  }, []);
  return <SetRoutes />;
};

// 初始化工作
export default App;
