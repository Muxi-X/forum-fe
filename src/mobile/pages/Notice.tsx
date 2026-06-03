import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Badge, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import MobileShell from '../components/MobileShell';
import SegmentTabs from '../components/SegmentTabs';
import EmptyState from '../components/EmptyState';
import LoadingState from '../components/LoadingState';
import MobileAvatar from '../components/MobileAvatar';
import { mobileMotion, mobilePalette, mobileRadius, Section } from '../styles';
import { ChatUser, mobileApi, PrivateMessage } from '../api';
import useNotification from 'store/useNotification';

const List = styled(Section)`
  margin-top: 0;
  padding: 2px 0 18px;
  background: ${mobilePalette.bg};
  border-top: 0;
  border-bottom: 0;
`;

const Item = styled.article`
  width: calc(100% - 28px);
  min-height: 72px;
  display: grid;
  grid-template-columns: 42px minmax(0, 1fr) auto;
  gap: 12px;
  align-items: center;
  margin: 0 auto 10px;
  padding: 13px 14px;
  background: ${mobilePalette.paper};
  border-radius: ${mobileRadius.lg};
  box-shadow: 0 8px 22px rgba(16, 24, 40, 0.05);
  cursor: pointer;
  text-align: left;
  h3 {
    margin: 0 0 5px;
    color: #1a202c;
    font-size: 14px;
  }
  p {
    margin: 0;
    color: ${mobilePalette.muted};
    line-height: 1.45;
    display: -webkit-box;
    overflow: hidden;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
`;

const Toolbar = styled.div`
  width: calc(100% - 28px);
  min-height: 36px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin: 0 auto 8px;
`;

const ClearButton = styled.button`
  height: 30px;
  padding: 0 11px;
  border-radius: ${mobileRadius.pill};
  background: rgba(255, 255, 255, 0.85);
  color: ${mobilePalette.muted};
  font-size: 12px;
  transition: transform ${mobileMotion.fast}, background ${mobileMotion.fast};
  &:active {
    transform: scale(0.96);
    background: #fff;
  }
`;

const DeleteButton = styled.button`
  min-width: 42px;
  height: 30px;
  padding: 0 9px;
  border-radius: ${mobileRadius.pill};
  background: rgba(60, 60, 67, 0.06);
  color: ${mobilePalette.muted};
  font-size: 12px;
`;

const noticeTitle: Record<string, string> = {
  like: '有人点赞了你的帖子',
  collection: '有人收藏了你的帖子',
  comment: '有人评论了你的帖子',
  reply_comment: '有人回复了评论',
};

const buildNoticeContent = (item: PrivateMessage) => {
  const sender = item.sender_name || '茶友';
  const title = item.post_title ? `《${item.post_title}》` : '你的帖子';
  const content = item.content || item.comment_content || '';
  if (item.type === 'like') return `${sender} 点赞了 ${title}`;
  if (item.type === 'collection') return `${sender} 收藏了 ${title}`;
  if (item.type === 'reply_comment')
    return `${sender} 回复了 ${title} 下的评论：${content}`;
  return `${sender} 评论了 ${title}${content ? `：${content}` : ''}`;
};

const toStoreNotifications = (items: PrivateMessage[]) =>
  items.map((item, index) => ({
    id: item.id || `${item.post_id}_${item.type}_${index}`,
    postId: Number(item.post_id),
    type: item.type as any,
    content: buildNoticeContent(item),
    read: false,
    timestamp: Date.now() - index,
  }));

const Notice: React.FC = () => {
  const nav = useNavigate();
  const [tab, setTab] = useState('all');
  const [notifications, setNotifications] = useState<PrivateMessage[]>([]);
  const [chatUsers, setChatUsers] = useState<ChatUser[]>([]);
  const [loadingNotice, setLoadingNotice] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const [error, setError] = useState('');
  const { replaceNotifications } = useNotification();

  const loadNotifications = async () => {
    setLoadingNotice(true);
    setError('');
    try {
      const res = await mobileApi.user.privateMessages({ limit: 80, page: 0 });
      if (res.code !== 0) {
        setError(res.message || '通知加载失败');
        return;
      }
      const next = (res.data.messages || []).filter((item) => item.post_id && item.type);
      setNotifications(next);
      replaceNotifications(toStoreNotifications(next));
    } catch (err) {
      setError(err instanceof Error ? err.message : '通知加载失败');
    } finally {
      setLoadingNotice(false);
    }
  };

  const loadChatUsers = async () => {
    setLoadingChat(true);
    mobileApi.chat
      .users({ limit: 50, page: 0 })
      .then((res) => {
        if (res.code === 0) setChatUsers(res.data || []);
      })
      .finally(() => setLoadingChat(false));
  };

  useEffect(() => {
    loadNotifications();
    loadChatUsers();
  }, []);

  const filtered = notifications.filter((item) => {
    if (tab === 'comment')
      return item.type === 'comment' || item.type === 'reply_comment';
    if (tab === 'engagement') return item.type === 'like' || item.type === 'collection';
    return true;
  });

  const removeNotice = async (event: React.MouseEvent, item: PrivateMessage) => {
    event.stopPropagation();
    if (!item.id) {
      message.warning('这条通知暂时不能单独忽略');
      return;
    }
    const res = await mobileApi.user.deletePrivateMessage(item.id);
    if (res.code !== 0) {
      message.error(res.message || '删除失败');
      return;
    }
    const next = notifications.filter((notice) => notice.id !== item.id);
    setNotifications(next);
    replaceNotifications(toStoreNotifications(next));
  };

  const clearAll = async () => {
    const res = await mobileApi.user.deletePrivateMessage();
    if (res.code !== 0) {
      message.error(res.message || '清空失败');
      return;
    }
    setNotifications([]);
    replaceNotifications([]);
    message.success('已清空通知');
  };

  return (
    <MobileShell title="消息" back tabs={false}>
      <SegmentTabs
        value={tab}
        items={[
          { label: '全部', value: 'all' },
          { label: '评论', value: 'comment' },
          { label: '赞藏', value: 'engagement' },
          { label: '私信', value: 'chat' },
        ]}
        onChange={(value) => setTab(String(value))}
      />
      {tab === 'chat' && loadingChat ? (
        <LoadingState text="正在读取私信..." />
      ) : tab === 'chat' ? (
        chatUsers.length ? (
          <List>
            {chatUsers.map((user) => (
              <Item key={user.id} onClick={() => nav(`/user/chat?target_id=${user.id}`)}>
                <MobileAvatar url={user.avatar} size={42} />
                <div>
                  <h3>{user.name || '茶友'}</h3>
                  <p>查看私信记录</p>
                </div>
              </Item>
            ))}
          </List>
        ) : (
          <EmptyState
            title="还没有私信"
            text="进入对方主页后，可以从私信按钮开始会话。"
          />
        )
      ) : loadingNotice ? (
        <LoadingState text="正在读取通知..." />
      ) : error ? (
        <EmptyState title="通知加载失败" text={error} />
      ) : filtered.length ? (
        <List>
          {tab === 'all' && notifications.length ? (
            <Toolbar>
              <ClearButton type="button" onClick={clearAll}>
                全部清空
              </ClearButton>
            </Toolbar>
          ) : null}
          {filtered.map((item, index) => (
            <Item
              key={item.id || `${item.post_id}_${index}`}
              onClick={() => {
                const postId = Number(item.post_id);
                if (postId) nav(`/article/${postId}`);
              }}
            >
              <Badge dot>
                <MobileAvatar url={item.avatar} size={42} />
              </Badge>
              <div>
                <h3>{noticeTitle[item.type || ''] || '新的通知'}</h3>
                <p>{buildNoticeContent(item)}</p>
              </div>
              <DeleteButton type="button" onClick={(event) => removeNotice(event, item)}>
                忽略
              </DeleteButton>
            </Item>
          ))}
        </List>
      ) : (
        <EmptyState title={tab === 'engagement' ? '还没有赞藏通知' : '还没有通知'} />
      )}
    </MobileShell>
  );
};

export default Notice;
