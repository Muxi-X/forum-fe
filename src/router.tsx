import React, { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter as Router, useRoutes, RouteObject } from 'react-router-dom';
import routes, { parse } from 'react-auto-routes';
import useRequest from 'hooks/useRequest';
import WS from 'utils/WS';
import useWS from 'store/useWS';
import Header from 'components/Header/header';
import useProfile from 'store/useProfile';
import useShowHeader from 'store/useShowHeader';
import ResultPage from 'pages/Result';
import 'antd/dist/antd.css';

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
        <Suspense fallback={<></>}>
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
  const { location } = window;
  const isSpecialPage = () => {
    const isLogin = location.pathname.includes('login');
    const isPost = location.pathname.includes('/editor/article');
    return isLogin || isPost;
  };

  const { setUser, setToken } = useProfile();
  const { setTip, setWS } = useWS();
  const { showHeader } = useShowHeader();

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

  // const { run: initWs } = useRequest(API.chat.getChat.request, {
  //   onSuccess: (res) => {
  //     webSocketInit(res.data.id as string);
  //   },
  //   refreshDeps: [],
  //   manual: true,
  // });

  const webSocketInit = () => {
    const token = localStorage.getItem('token') as string;
    const WebSocket = new WS(token);
    WebSocket.ws.onmessage = () => {
      setTip(true);
    };
    setWS(WebSocket);
  };

  useEffect(() => {
    if (isSpecialPage()) {
      return;
    } else {
      getUser({});
      getQiniuToken({});
      webSocketInit();
    }
  }, []);
  return (
    <Router>
      {showHeader ? <Header /> : null}
      <Routes />
    </Router>
  );
};

// 初始化工作
export default SetRoutes;
