import React from 'react';
import styled from 'styled-components';
import { useNavigate, useOutlet } from 'react-router';
import ArticleList from './components/ariticle_list';

const Header = styled.header`
  width: 100vw;
  height: 2em;
  background-color: #c0ddf7;
`;

const Tags = styled.section`
  width: 100vw;
  background-color: #014de4;
`;

const Square: React.FC = () => {
  const nav = useNavigate();
  return (
    <>
      <Header>
        头部组件
        <button
          onClick={() => {
            nav(`/editor/new__${new Date().getTime()}`);
          }}
        >
          去编辑页面
        </button>
      </Header>
      <Tags>标签栏</Tags>
      <ArticleList />
      {useOutlet()}
    </>
  );
};

export default Square;
