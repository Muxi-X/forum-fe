import React from 'react';
import styled from 'styled-components';
import { Card } from 'antd';
import { LeftOutlined } from '@ant-design/icons';
import { color } from 'styles/global';
import { useNavigate } from 'react-router';
import useProfile from 'store/useProfile';

const BackLink = styled.span`
  font-size: 14px;
  color: #5e646e;
  cursor: pointer;
  :hover {
    color: ${color};
  }
`;

const BackCard = styled(Card)`
  margin: 24px auto 16px;
  padding-left: 22px;
  height: 3.833rem;
  .ant-card-body {
    display: flex;
    align-items: center;
    padding: 0;
    height: 100%;
  }
`;

const Back: React.FC = () => {
  const nav = useNavigate();
  const {
    userProfile: { id },
  } = useProfile();
  return (
    <BackCard>
      <BackLink
        onClick={() => {
          nav(`/user/${id}`);
        }}
      >
        <LeftOutlined />
        返回个人主页
      </BackLink>
    </BackCard>
  );
};

export default Back;
