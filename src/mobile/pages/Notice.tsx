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
import {
  buildNoticeContent,
  fetchInteractionNotifications,
  getNoticeTime,
  noticeTitle,
  toStoreNotifications,
} from '../notificationSync';

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
  grid-template-columns: 42px minmax(0, 1fr);
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

const MarkReadButton = styled.button`
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

const ContentWrap = styled.div`
  min-width: 0;
`;

const DotBadge = styled(Badge)`
  .ant-badge-dot {
    right: 2px;
    top: 3px;
  }
`;

const getChatTime = (user: ChatUser, index = 0) => {
  const time = user.last_message_time ? new Date(user.last_message_time).getTime() : 0;
  return Number.isFinite(time) && time > 0 ? time : Date.now() - index;
};

type ListEntry =
  | { kind: 'notice'; item: PrivateMessage; time: number; key: string }
  | { kind: 'chat'; item: ChatUser; time: number; key: string };

const Notice: React.FC = () => {
  const nav = useNavigate();
  const [tab, setTab] = useState('all');
  const [notifications, setNotifications] = useState<PrivateMessage[]>([]);
  const [chatUsers, setChatUsers] = useState<ChatUser[]>([]);
  const [loadingNotice, setLoadingNotice] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const [error, setError] = useState('');
  const {
    replaceNotifications,
    markAsRead,
    markAllAsRead,
    markChatRead,
    markAllChatRead,
    chatUnread,
    totalUnreadCount,
  } = useNotification();

  const loadNotifications = async () => {
    setLoadingNotice(true);
    setError('');
    try {
      const next = await fetchInteractionNotifications();
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

  const allEntries: ListEntry[] = [
    ...notifications.map((item, index) => ({
      kind: 'notice' as const,
      item,
      time: getNoticeTime(item, index),
      key: item.id || `notice_${item.post_id}_${item.type}_${index}`,
    })),
    ...chatUsers.map((item, index) => ({
      kind: 'chat' as const,
      item,
      time: getChatTime(item, index),
      key: `chat_${item.id || index}`,
    })),
  ].sort((a, b) => b.time - a.time);

  const markNoticeRead = async (item: PrivateMessage) => {
    if (!item.id) {
      return;
    }
    const next = notifications.map((notice) =>
      notice.id === item.id ? { ...notice, read: true } : notice,
    );
    setNotifications(next);
    replaceNotifications(toStoreNotifications(next));
    markAsRead(item.id);
    const res = await mobileApi.user.markPrivateMessageRead(item.id);
    if (res.code !== 0) {
      console.error('标记通知已读失败:', res.message);
    }
  };

  const markAllRead = async () => {
    const next = notifications.map((notice) => ({ ...notice, read: true }));
    setNotifications(next);
    replaceNotifications(toStoreNotifications(next));
    markAllAsRead();
    markAllChatRead();
    const res = await mobileApi.user.markPrivateMessageRead();
    if (res.code !== 0) {
      message.warning('已本地标记，刷新后可能恢复');
      return;
    }
    message.success('已全部已读');
  };

  const openNotice = async (item: PrivateMessage) => {
    if (!item.read) {
      await markNoticeRead(item);
    }
    const postId = Number(item.post_id);
    if (postId) nav(`/article/${postId}`);
  };

  const openChat = (user: ChatUser) => {
    if (user.id) {
      markChatRead(user.id);
      nav(`/user/chat?target_id=${user.id}`);
    }
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
              <Item key={user.id} onClick={() => openChat(user)}>
                <DotBadge dot={Boolean(user.id && chatUnread[user.id])}>
                  <MobileAvatar url={user.avatar} size={42} />
                </DotBadge>
                <ContentWrap>
                  <h3>{user.name || '茶友'}</h3>
                  <p>{user.last_message || '查看私信记录'}</p>
                </ContentWrap>
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
      ) : tab === 'all' && allEntries.length ? (
        <List>
          {totalUnreadCount > 0 ? (
            <Toolbar>
              <MarkReadButton type="button" onClick={markAllRead}>
                全部已读
              </MarkReadButton>
            </Toolbar>
          ) : null}
          {allEntries.map((entry) =>
            entry.kind === 'chat' ? (
              <Item key={entry.key} onClick={() => openChat(entry.item)}>
                <DotBadge dot={Boolean(entry.item.id && chatUnread[entry.item.id])}>
                  <MobileAvatar url={entry.item.avatar} size={42} />
                </DotBadge>
                <ContentWrap>
                  <h3>{entry.item.name || '茶友'}</h3>
                  <p>{entry.item.last_message || '查看私信记录'}</p>
                </ContentWrap>
              </Item>
            ) : (
              <Item key={entry.key} onClick={() => openNotice(entry.item)}>
                <DotBadge dot={!entry.item.read}>
                  <MobileAvatar url={entry.item.avatar} size={42} />
                </DotBadge>
                <ContentWrap>
                  <h3>{noticeTitle[entry.item.type || ''] || '新的通知'}</h3>
                  <p>{buildNoticeContent(entry.item)}</p>
                </ContentWrap>
              </Item>
            ),
          )}
        </List>
      ) : filtered.length ? (
        <List>
          {filtered.map((item, index) => (
            <Item
              key={item.id || `${item.post_id}_${index}`}
              onClick={() => openNotice(item)}
            >
              <DotBadge dot={!item.read}>
                <MobileAvatar url={item.avatar} size={42} />
              </DotBadge>
              <ContentWrap>
                <h3>{noticeTitle[item.type || ''] || '新的通知'}</h3>
                <p>{buildNoticeContent(item)}</p>
              </ContentWrap>
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
