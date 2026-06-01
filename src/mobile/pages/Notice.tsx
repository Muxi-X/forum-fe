import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Badge } from 'antd';
import { useNavigate } from 'react-router-dom';
import MobileShell from '../components/MobileShell';
import SegmentTabs from '../components/SegmentTabs';
import EmptyState from '../components/EmptyState';
import { mobilePalette, Section } from '../styles';
import { ChatUser, mobileApi } from '../api';
import useNotification, { Notification } from 'store/useNotification';
import moment from 'utils/moment';

const List = styled(Section)`
  margin-top: 10px;
`;

const Item = styled.button`
  width: 100%;
  min-height: 68px;
  display: grid;
  grid-template-columns: 42px 1fr;
  gap: 12px;
  align-items: center;
  padding: 12px 16px;
  background: transparent;
  border-bottom: 1px solid ${mobilePalette.line};
  text-align: left;
  img {
    width: 42px;
    height: 42px;
    border-radius: 50%;
    object-fit: cover;
  }
  h3 {
    margin: 0 0 5px;
    font-size: 15px;
  }
  p {
    margin: 0;
    color: ${mobilePalette.muted};
    line-height: 1.45;
  }
`;

const Notice: React.FC = () => {
  const nav = useNavigate();
  const [tab, setTab] = useState('all');
  const [chatUsers, setChatUsers] = useState<ChatUser[]>([]);
  const { notifications, markAsRead } = useNotification();

  useEffect(() => {
    mobileApi.chat.users({ limit: 50, page: 0 }).then((res) => {
      if (res.code === 0) setChatUsers(res.data || []);
    });
  }, []);

  const filtered = notifications.filter((item) => {
    if (tab === 'comment')
      return item.type === 'comment' || item.type === 'reply_comment';
    if (tab === 'mention') return false;
    return true;
  });

  return (
    <MobileShell title="消息" back tabs={false}>
      <SegmentTabs
        value={tab}
        items={[
          { label: '全部', value: 'all' },
          { label: '评论', value: 'comment' },
          { label: '@我', value: 'mention' },
          { label: '私信', value: 'chat' },
        ]}
        onChange={(value) => setTab(String(value))}
      />
      {tab === 'chat' ? (
        chatUsers.length ? (
          <List>
            {chatUsers.map((user) => (
              <Item key={user.id} onClick={() => nav(`/user/chat?target_id=${user.id}`)}>
                <img
                  src={user.avatar || 'https://ossforum.muxixyz.com/default/avatar.png'}
                  alt=""
                />
                <div>
                  <h3>{user.name || '茶友'}</h3>
                  <p>查看私信记录</p>
                </div>
              </Item>
            ))}
          </List>
        ) : (
          <EmptyState text="还没有私信" />
        )
      ) : filtered.length ? (
        <List>
          {filtered.map((item: Notification) => (
            <Item
              key={item.id}
              onClick={() => {
                markAsRead(item.id);
                nav(`/article/${item.postId}`);
              }}
            >
              <Badge dot={!item.read}>
                <img src="https://ossforum.muxixyz.com/default/avatar.png" alt="" />
              </Badge>
              <div>
                <h3>
                  {item.type === 'like'
                    ? '有人点赞了你'
                    : item.type === 'collection'
                    ? '有人收藏了你'
                    : '有人评论了你'}
                </h3>
                <p>
                  {item.content} · {moment(item.timestamp).fromNow()}
                </p>
              </div>
            </Item>
          ))}
        </List>
      ) : (
        <EmptyState text={tab === 'mention' ? '还没有 @ 你的消息' : '还没有通知'} />
      )}
    </MobileShell>
  );
};

export default Notice;
