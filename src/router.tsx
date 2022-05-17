import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, useRoutes, RouteObject } from 'react-router-dom';
import routes, { parse } from 'react-auto-routes';
import Home from 'pages/Home';
import Login from 'pages/Login/Login';
import Square from 'pages/Square/square';
import User from 'pages/User';
import Article from 'pages/Article';
import Editor from 'pages/Editor/Editor';
import Draft from 'pages/Draft';
import NotFount from 'pages/NotFount';

namespace SyncRoute {
  export type Routes = {
    path: string;
    component: React.LazyExoticComponent<any>;
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
          <route.component />
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
