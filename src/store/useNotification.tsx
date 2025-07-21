import create from 'zustand';

export interface Notification {
  id: string;
  postId: number;
  postTitle: string;
  type: 'like' | 'comment' | 'collection';
  content: string;
  read: boolean;
  timestamp: number;
}

interface NotificationStore {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Notification) => void;
  deleteNotification: () => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
}

const useNotification = create<NotificationStore>((set, get) => ({
  notifications: [],
  unreadCount: 0,

  addNotification: (notification) => {
    const { notifications, unreadCount } = get();
    set(() => ({
      notifications: [...notifications, notification],
      unreadCount: unreadCount + 1,
    }));
  },

  deleteNotification: () => {
    const { notifications } = get();
    const unreadNotifications = notifications.filter(
      (notification) => !notification.read,
    );
    set(() => ({
      notifications: unreadNotifications,
      unreadCount: unreadNotifications.length,
    }));
  },

  markAsRead: (id) => {
    const { notifications, unreadCount } = get();
    const updatedNotifications = notifications.map((notification) =>
      notification.id === id ? { ...notification, read: true } : notification,
    );
    const newUnreadCount = Math.max(0, unreadCount - 1);
    set(() => ({
      notifications: updatedNotifications,
      unreadCount: newUnreadCount,
    }));
  },

  markAllAsRead: () => {
    const { notifications } = get();
    const updatedNotifications = notifications.map((notification) => ({
      ...notification,
      read: true,
    }));
    set(() => ({
      notifications: updatedNotifications,
      unreadCount: 0,
    }));
  },
}));

export default useNotification;
