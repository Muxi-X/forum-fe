import useNotification, { Notification } from 'store/useNotification';
import { mobileApi, PrivateMessage } from './api';
import { refreshChatUnreadStore } from './chatSync';

export const notificationPollIntervalMs = 5000;

export const noticeTitle: Record<string, string> = {
  like: '有人点赞了你的帖子',
  collection: '有人收藏了你的帖子',
  comment: '有人评论了你的帖子',
  reply_comment: '有人回复了评论',
};

export const buildNoticeContent = (item: PrivateMessage) => {
  const sender = item.sender_name || '茶友';
  const title = item.post_title ? `《${item.post_title}》` : '你的帖子';
  const content = item.content || item.comment_content || '';
  if (item.type === 'like') return `${sender} 点赞了 ${title}`;
  if (item.type === 'collection') return `${sender} 收藏了 ${title}`;
  if (item.type === 'reply_comment')
    return `${sender} 回复了 ${title} 下的评论：${content}`;
  return `${sender} 评论了 ${title}${content ? `：${content}` : ''}`;
};

export const getNoticeTime = (item: PrivateMessage, index = 0) => {
  const time = item.created_at ? new Date(item.created_at).getTime() : 0;
  return Number.isFinite(time) && time > 0 ? time : Date.now() - index;
};

export const toStoreNotifications = (items: PrivateMessage[]): Notification[] =>
  items.map((item, index) => ({
    id: item.id || `${item.post_id}_${item.type}_${index}`,
    postId: Number(item.post_id),
    type: item.type as Notification['type'],
    content: buildNoticeContent(item),
    read: Boolean(item.read),
    timestamp: getNoticeTime(item, index),
  }));

export const fetchInteractionNotifications = async () => {
  const res = await mobileApi.user.privateMessages({ limit: 80, page: 0 });
  if (res.code !== 0) {
    throw new Error(res.message || '通知加载失败');
  }
  return (res.data.messages || []).filter((item) => item.post_id && item.type);
};

export const refreshNotificationStore = async () => {
  const [notificationResult, chatResult] = await Promise.allSettled([
    fetchInteractionNotifications(),
    refreshChatUnreadStore(),
  ]);
  if (chatResult.status === 'rejected') {
    console.error('刷新私信红点失败:', chatResult.reason);
  }
  if (notificationResult.status === 'rejected') {
    throw notificationResult.reason;
  }
  const notifications = notificationResult.value;
  useNotification.getState().replaceNotifications(toStoreNotifications(notifications));
  return notifications;
};
