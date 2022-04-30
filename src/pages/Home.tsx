import React from 'react';
import { useOutlet, useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
  const nav = useNavigate();
  return (
    <>
      我是首页
      {useOutlet()}
      <button onClick={() => nav(`/editor/drafts/new__${new Date().getTime()}`)}>
        点我去编辑页面
      </button>
    </>
  );
};

export default Home;
