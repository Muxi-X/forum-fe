import React, { useEffect, useState } from 'react';
import { useOutlet, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import Card from 'components/Card/card';
import Avatar from 'components/Avatar/avatar';
import Button from 'components/Button/button';
import Service from 'service/fetch';

const UserWrapper = styled.div`
  margin-top: 5vh;
`;

const UserInfo = styled.section`
  display: flex;
  justify-content: space-between;
`;

const Info = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const NameAndSign = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 2em;
  font-size: 1.5em;
`;

const Links = styled.div`
  width: 50%;
  display: flex;
  justify-content: space-between;
  margin-top: 3em;
`;
const User: React.FC = () => {
  const { Link } = Button;
  const location = useLocation();
  const [user, setUser] = useState({});

  useEffect(() => {
    const id = localStorage.getItem('id');
    Service.getUser(id).then((res: any) => {
      setUser(res.data);
    });
  }, []);

  if (location.pathname.includes('seting')) {
    return (
      <UserWrapper>
        <Card>{useOutlet()}</Card>
      </UserWrapper>
    );
  }

  return (
    <UserWrapper>
      <Card>
        <UserInfo>
          <Info>
            <Avatar size={'large'} />
            <NameAndSign>
              <div>基地班王丰</div>
              <div>我是人工智能King!</div>
            </NameAndSign>
          </Info>
          <Link to={'seting'}>设置</Link>
        </UserInfo>
        <Links>
          <Link to={'like'}>我的发布</Link>
          <Link to={'collect'}>我的收藏</Link>
        </Links>
        <div>{useOutlet()}</div>
      </Card>
    </UserWrapper>
  );
};

export default User;
