import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router';

const Header = styled.header`
  width: 100vw;
  height: 2em;
  background-color: #c0ddf7;
`;

const Square: React.FC = () => {
  const nav = useNavigate();
  return (
    <>
      <Header>
        头部组件
        <button
          onClick={() => {
            nav(`/editor/drafts/new__${new Date().getTime()}`);
          }}
        >
          去编辑页面
        </button>
      </Header>
      文章广场
    </>
  );
};

export default Square;
