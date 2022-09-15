import React from 'react';
import styled from 'styled-components';
import { Button } from 'antd';
import { useNavigate } from 'react-router';
import Avatar from 'components/Avatar/avatar';

const Input = styled.input`
  border: 1px solid black;
  padding: 5px;
`;

const Seting: React.FC = () => {
  const nav = useNavigate();
  return (
    <>
      <Avatar size={'large'} fix />
      <br />
      <br />
      修改你的新密码
      <div>
        <Input type="text" />
      </div>
      修改你的新简介
      <div>
        <Input type="text" />
      </div>
      <Button style={{ marginTop: '2em' }} type={'primary'}>
        保存修改
      </Button>
      <Button
        onClick={() => {
          nav('/user');
        }}
        style={{ marginTop: '2em', marginLeft: '2em' }}
        type={'primary'}
      >
        返回
      </Button>
    </>
  );
};

export default Seting;
