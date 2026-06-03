import useNotification from 'store/useNotification';
import { ChatUser, mobileApi } from './api';

export const chatListQuery = { limit: 50, page: 0 };

export const toChatUnreadMap = (users: ChatUser[] = []) =>
  Object.fromEntries(
    users
      .map((user) => [Number(user.id), Number(user.unread_count || 0)] as const)
      .filter(([userId, count]) => userId > 0 && count > 0),
  );

export const refreshChatUnreadStore = async () => {
  const res = await mobileApi.chat.users(chatListQuery);
  if (res.code !== 0) {
    throw new Error(res.message || '私信加载失败');
  }
  const users = res.data || [];
  useNotification.getState().replaceChatUnread(toChatUnreadMap(users));
  return users;
};

export const markChatConversationRead = async (userId: number) => {
  if (!userId) return;
  useNotification.getState().markChatRead(userId);
  const res = await mobileApi.chat.markRead(userId);
  if (res.code !== 0) {
    throw new Error(res.message || '私信已读失败');
  }
};
