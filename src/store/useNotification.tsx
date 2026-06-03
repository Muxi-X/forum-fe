import create from 'zustand';

export interface Notification {
  id: string;
  postId: number;
  type: 'like' | 'comment' | 'collection' | 'reply_comment';
  content: string;
  read: boolean;
  timestamp: number;
}

interface ChatUnread {
  [userId: number]: number;
}

const chatUnreadStorageKey = 'forum_chat_unread';

const loadChatUnread = (): ChatUnread => {
  if (typeof localStorage === 'undefined') return {};
  try {
    const raw = localStorage.getItem(chatUnreadStorageKey);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return {};
    return Object.fromEntries(
      Object.entries(parsed)
        .map(([key, value]) => [Number(key), Number(value)])
        .filter(([key, value]) => key > 0 && value > 0),
    );
  } catch {
    return {};
  }
};

const saveChatUnread = (chatUnread: ChatUnread) => {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(chatUnreadStorageKey, JSON.stringify(chatUnread));
};

interface NotificationStore {
  notifications: Notification[];
  unreadCount: number;
  chatUnread: ChatUnread;
  chatUnreadCount: number;
  totalUnreadCount: number;
  addNotifications: (notifications: Notification[]) => void;
  replaceNotifications: (notifications: Notification[]) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  markChatUnread: (userId: number) => void;
  markChatRead: (userId: number) => void;
  markAllChatRead: () => void;
  replaceChatUnread: (chatUnread: ChatUnread) => void;
  resetNotifications: () => void;
}

const sumChatUnread = (chatUnread: ChatUnread) =>
  Object.values(chatUnread).reduce((total, count) => total + count, 0);

const withUnreadTotals = (
  notifications: Notification[],
  chatUnread: ChatUnread,
): Pick<NotificationStore, 'unreadCount' | 'chatUnreadCount' | 'totalUnreadCount'> => {
  const unreadCount = notifications.filter((notification) => !notification.read).length;
  const chatUnreadCount = sumChatUnread(chatUnread);
  return {
    unreadCount,
    chatUnreadCount,
    totalUnreadCount: unreadCount + chatUnreadCount,
  };
};

const initialChatUnread = loadChatUnread();

const useNotification = create<NotificationStore>((set, get) => ({
  notifications: [],
  chatUnread: initialChatUnread,
  unreadCount: withUnreadTotals([], initialChatUnread).unreadCount,
  chatUnreadCount: withUnreadTotals([], initialChatUnread).chatUnreadCount,
  totalUnreadCount: withUnreadTotals([], initialChatUnread).totalUnreadCount,

  addNotifications: (newNotifications) => {
    const { notifications, chatUnread } = get();
    const nextNotifications = [...notifications, ...newNotifications];
    set(() => ({
      notifications: nextNotifications,
      ...withUnreadTotals(nextNotifications, chatUnread),
    }));
  },

  replaceNotifications: (newNotifications) => {
    const { chatUnread } = get();
    set(() => ({
      notifications: newNotifications,
      ...withUnreadTotals(newNotifications, chatUnread),
    }));
  },

  markAsRead: (id) => {
    const { notifications, chatUnread } = get();
    const updatedNotifications = notifications.map((notification) =>
      notification.id === id ? { ...notification, read: true } : notification,
    );
    set(() => ({
      notifications: updatedNotifications,
      ...withUnreadTotals(updatedNotifications, chatUnread),
    }));
  },

  markAllAsRead: () => {
    const { notifications, chatUnread } = get();
    const updatedNotifications = notifications.map((notification) => ({
      ...notification,
      read: true,
    }));
    set(() => ({
      notifications: updatedNotifications,
      ...withUnreadTotals(updatedNotifications, chatUnread),
    }));
  },

  markChatUnread: (userId) => {
    if (!userId) return;
    const { notifications, chatUnread } = get();
    const nextChatUnread = {
      ...chatUnread,
      [userId]: (chatUnread[userId] || 0) + 1,
    };
    saveChatUnread(nextChatUnread);
    set(() => ({
      chatUnread: nextChatUnread,
      ...withUnreadTotals(notifications, nextChatUnread),
    }));
  },

  markChatRead: (userId) => {
    if (!userId) return;
    const { notifications, chatUnread } = get();
    const nextChatUnread = { ...chatUnread };
    delete nextChatUnread[userId];
    saveChatUnread(nextChatUnread);
    set(() => ({
      chatUnread: nextChatUnread,
      ...withUnreadTotals(notifications, nextChatUnread),
    }));
  },

  markAllChatRead: () => {
    const { notifications } = get();
    saveChatUnread({});
    set(() => ({
      chatUnread: {},
      ...withUnreadTotals(notifications, {}),
    }));
  },

  replaceChatUnread: (chatUnread) => {
    const { notifications } = get();
    saveChatUnread(chatUnread);
    set(() => ({
      chatUnread,
      ...withUnreadTotals(notifications, chatUnread),
    }));
  },

  resetNotifications: () => {
    const { notifications } = get();
    const readNotifications = notifications.filter((notification) => notification.read);
    saveChatUnread({});
    set(() => ({
      notifications: readNotifications,
      chatUnread: {},
      ...withUnreadTotals(readNotifications, {}),
    }));
  },
}));

export default useNotification;
