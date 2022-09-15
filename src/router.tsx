import React, { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter as Router, useRoutes, RouteObject } from 'react-router-dom';
import routes, { parse } from 'react-auto-routes';
import { useRequest } from 'ahooks';
import useProfile from 'store/useProfile';

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
        <Suspense fallback={<div>路由加载ing...</div>}>
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

// 初始化工作
const SetRoutes = () => {
  const profileStore = useProfile();
  useRequest(API.user.getUserMyprofile.request, {
    onSuccess: (res) => {
      profileStore.setUser(res.data);
    },
  });

  return (
    <Router>
      <Routes />
    </Router>
  );
};

export default SetRoutes;
