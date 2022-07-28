import React, { useState } from 'react';
import styled from 'styled-components';
import { Button } from 'antd';
import {
  HomeOutlined,
  EditOutlined,
  UserOutlined,
  MessageOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import useList from 'store/useList';
import Btn from 'components/Button/button';
import Card from 'components/Card/card';
import Service from 'service/fetch';
import './header.css';

const Wrapper = styled.header`
  width: 100vw;
  height: 2em;
  display: flex;
  justify-content: space-around;
  align-items: center;
  font-size: 20px;
`;

const SearchInput = styled.input`
  padding: 0.3em;
  padding-left: 0.5em;
  font-size: 14px;
  border-radius: 3px;
  height: 2.5em;
  border: 1px solid black;
  :hover {
    border: 1px solid blue;
  }
  width: 20em;
`;

const InputWrapper = styled.div`
  position: relative;
`;

const Header: React.FC = () => {
  const { Link } = Btn;
  const [query, setQuery] = useState('');
  const list = useList();
  const id = localStorage.getItem('id');

  const handleSearch = () => {
    Service.SearchList(query).then((res: any) => {
      list.setList(res.list);
    });
  };
  return (
    <Card content={false}>
      <Wrapper>
        <Link to="/" Tips="主页">
          <HomeOutlined style={{ fontSize: '1.6em' }} />
        </Link>
        <Link
          to={`/editor/article${new Date().getTime()}`}
          target={'_blank'}
          Tips="发布文章"
        >
          <EditOutlined style={{ fontSize: '1.6em' }} />
        </Link>
        <InputWrapper>
          <SearchInput
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
            }}
            placeholder="输入搜索内容 :D"
            type="text"
          />
          <Button
            onClick={handleSearch}
            icon={<SearchOutlined />}
            className="tt"
          ></Button>
        </InputWrapper>
        <Link to="message" Tips="查看消息">
          <MessageOutlined style={{ fontSize: '1.6em' }} />
        </Link>
        <Link to={`user/${id}`} Tips="个人页面">
          <UserOutlined style={{ fontSize: '1.6em' }} />
        </Link>
      </Wrapper>
    </Card>
  );
};

export default Header;
