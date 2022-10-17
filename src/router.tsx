import React, { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter as Router, useRoutes, RouteObject } from 'react-router-dom';
import routes, { parse } from 'react-auto-routes';
import useRequest from 'hooks/useRequest';
import Header from 'components/Header/header';
import useProfile from 'store/useProfile';
import useShowHeader from 'store/useShowHeader';
import { ContentWrapper, Content } from 'pages/_layout';
import Loading from 'components/Loading';

namespace SyncRoute {
  export type Routes = {
    path: string;
    element: React.LazyExoticComponent<any>;
    children?: Routes[];
  };
}

const syncRouter = (table: SyncRoute.Routes[]): RouteObject[] => {
  let mRouteTable: RouteObject[] = [];
  table.forEach((route) => {
    mRouteTable.push({
      path: route.path,
      element: (
        <Suspense
          fallback={
            <ContentWrapper>
              <Content>
                <Loading />
              </Content>
            </ContentWrapper>
          }
        >
          <route.element />
        </Suspense>
      ),
      children: route.children && syncRouter(route.children),
    });
  });
  return mRouteTable;
};

const Routes = () => {
  return useRoutes(syncRouter(parse(routes, lazy)));
};

const SetRoutes = () => {
  const { showHeader } = useShowHeader();

  return (
    <Router>
      {showHeader ? <Header /> : null}
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
  }, []);
  return <SetRoutes />;
};

// 初始化工作
export default App;
