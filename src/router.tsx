import React from 'react';
import { BrowserRouter as Router, useRoutes } from 'react-router-dom';
import Home from 'pages/Home';
import Login from 'pages/Login';
import User from 'pages/User';
import Article from 'pages/Article';
import Editor from 'pages/Editor/Editor';
import Draft from 'pages/Draft';
import NotFount from 'pages/NotFount';

const GetRoutes = () => {
  const routes = useRoutes([
    {
      path: '/',
      element: <Home />,
      children: [
        {
          path: 'article',
          element: <Article />,
        },
      ],
    },
    {
      path: '/login',
      element: <Login />,
    },
    {
      path: '/user',
      element: <User />,
      children: [
        {
          path: 'drafts',
          element: <Draft />,
        },
      ],
    },
    {
      path: '/editor/drafts/:id',
      element: <Editor />,
    },
    {
      path: '*',
      element: <NotFount />,
    },
  ]);
  return routes;
};

const SetRoutes = () => {
  return (
    <Router>
      <GetRoutes />
    </Router>
  );
};

export default SetRoutes;
