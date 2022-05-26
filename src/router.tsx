import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, useRoutes, RouteObject } from 'react-router-dom';
import routes, { parse } from 'react-auto-routes';

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

const SetRoutes = () => {
  return (
    <Router>
      <Routes />
    </Router>
  );
};

export default SetRoutes;
