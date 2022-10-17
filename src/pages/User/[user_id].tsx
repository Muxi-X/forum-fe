import React, { useState } from 'react';
import styled from 'styled-components';
import { useLocation, useParams, useNavigate, useOutlet } from 'react-router-dom';
import { Card, Button, Tabs } from 'antd';
import useProfile from 'store/useProfile';
import Avatar from 'components/Avatar/avatar';
import useRequest from 'hooks/useRequest';
import Post from './[user_id]/post';
import Collect from './[user_id]/collect';
import Like from './[user_id]/like';
import Feed from './[user_id]/index';
import Loading from 'components/Loading';
import Back from './component/back';
import * as style from './style';
import useDocTitle from 'hooks/useDocTitle';
import BackToTop from 'components/BackTop';

const UserInfoCard = styled(Card)`
  .ant-card-body {
    width: auto;
    display: flex;
    align-items: center;
    height: 30vh;
  }
`;

const ToolsTabs = styled(Tabs)`
  background-color: white;
  margin-top: 2vh !important;
  .ant-tabs-nav-wrap {
    padding-left: 2em;
  }
  .ant-tabs-nav {
    margin-bottom: 0 !important;
  }
`;

const User: React.FC = () => {
  const { pathname } = useLocation();
  const { user_id } = useParams();
  const {
    userProfile: { id, avatar },
  } = useProfile();
  const nav = useNavigate();
  const outlet = useOutlet();

  const key = location.pathname.slice(location.pathname.lastIndexOf('/') + 1);

  const [tabKey, setTabKey] = useState(key);

  const { data: user, loading } = useRequest(API.user.getUserProfileById.request, {
    defaultParams: [{ id: +(user_id as string) }],
    refreshDeps: [user_id],
    onSuccess: (res) => {
      useDocTitle(`${res?.data.name} - 仙风道骨 - 论坛`);
    },
  });

  const isMyself = user?.data.id === id;
  const isRole = user?.data.role?.includes('Admin');

  const items = [
    {
      label: `动态`,
      key: `${user_id}`,
      children: tabKey === `${user_id}` ? <Feed /> : null,
    },
    {
      label: `点赞`,
      key: `like`,
      children: tabKey === 'like' ? <Like /> : null,
    },
    {
      label: `收藏`,
      key: 'collect',
      children: tabKey === 'collect' ? <Collect /> : null,
    },
    {
      label: `发布`,
      key: 'post',
      children: tabKey === 'post' ? <Post /> : null,
    },
  ];

  const handleChange = (key: string) => {
    setTabKey(key);
    key === `${user_id}`
      ? history.pushState({ tabKey: key }, key, `/user/${user_id}`)
      : history.pushState({ tabKey: key }, key, `/user/${user_id}/${key}`);
  };

  if (pathname === `/user/${user_id}/seting` || pathname === `/user/${user_id}/drafts`) {
    return (
      <style.UserWrapper>
        <Back />
        {outlet}
      </style.UserWrapper>
    );
  }

  return (
    <>
      <style.UserWrapper>
        {loading ? (
          <Loading />
        ) : (
          <UserInfoCard>
            <style.Info>
              <Avatar
                size={'large'}
                src={isMyself ? avatar : user?.data.avatar}
                userId={+(user_id as string)}
              />
              <style.NameAndSign>
                <div className="user-name">{user?.data.name}</div>
                <div className="user-signature">{user?.data.signature}</div>
              </style.NameAndSign>
            </style.Info>

            <style.Tools>
              {isMyself ? null : (
                <Button
                  onClick={() => {
                    nav('/user/chat', { state: { id: user_id } });
                  }}
                  type="ghost"
                >
                  发私信
                </Button>
              )}
              {isMyself ? (
                <>
                  <Button
                    onClick={() => {
                      nav('seting');
                    }}
                    type="ghost"
                  >
                    编辑个人资料
                  </Button>
                  <Button
                    onClick={() => {
                      nav('drafts');
                    }}
                    type="ghost"
                  >
                    草稿箱
                  </Button>
                </>
              ) : null}
              {isRole && isMyself ? (
                <Button
                  onClick={() => {
                    nav('/admin');
                  }}
                  type="ghost"
                >
                  审核举报
                </Button>
              ) : null}
            </style.Tools>
          </UserInfoCard>
        )}
        <ToolsTabs onChange={handleChange} defaultActiveKey={tabKey} items={items} />
        <BackToTop />
      </style.UserWrapper>
    </>
  );
};

export default User;
