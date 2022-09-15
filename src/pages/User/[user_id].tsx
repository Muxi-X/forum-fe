import React, { useEffect, useState } from 'react';
import { useOutlet, useLocation, useParams } from 'react-router-dom';
import Card from 'components/Card/card';
import Avatar from 'components/Avatar/avatar';
import Button from 'components/Button/button';
import useProfile from 'store/useProfile';
import * as style from './style';

const User: React.FC = () => {
  const { Link } = Button;
  const location = useLocation();
  const profileStore = useProfile();
  const [user, setUser] = useState({});
  const { user_id } = useParams();

  if (location.pathname.includes('seting')) {
    return (
      <style.UserWrapper>
        <Card>{useOutlet()}</Card>
      </style.UserWrapper>
    );
  }

  return (
    <style.UserWrapper>
      <style.UserInfo>
        <style.Info>
          <Avatar size={'large'} />
          <style.NameAndSign>
            <div>基地班王丰</div>
            <div>我是人工智能King!</div>
          </style.NameAndSign>
          <Link to="/user/chat">聊天</Link>
        </style.Info>
        <Link to="seting">设置</Link>
      </style.UserInfo>
      <style.Links>
        <Link to="like">我的发布</Link>
        <Link to="collect">我的收藏</Link>
      </style.Links>
      <div>{useOutlet()}</div>
    </style.UserWrapper>
  );
};

export default User;
