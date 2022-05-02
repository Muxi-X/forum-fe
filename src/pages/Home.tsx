import React from 'react';
import { useOutlet, useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
  const nav = useNavigate();
  return (
    <>
      我是首页
      {useOutlet()}
      <button onClick={() => nav(`/login`)}>点我去登录页面</button>
    </>
  );
};

export default Home;
