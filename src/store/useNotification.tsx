import create from 'zustand';

export interface Notification {
  id: string;
  postId: number;
  type: 'like' | 'comment' | 'collection' | 'reply_comment';
  content: string;
  read: boolean;
  timestamp: number;
}

interface NotificationStore {
  notifications: Notification[];
  unreadCount: number;

  addNotifications: (notifications: Notification[]) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  resetNotifications: () => void;
}

const useNotification = create<NotificationStore>((set, get) => ({
  notifications: [],
  unreadCount: 0,

  addNotifications: (newNotifications) => {
    const { notifications, unreadCount } = get();
    set(() => ({
      notifications: [...notifications, ...newNotifications],
      unreadCount: unreadCount + newNotifications.length,
    }));
  },

  markAsRead: (id) => {
    const { notifications, unreadCount } = get();
    const updatedNotifications = notifications.map((notification) =>
      notification.id === id ? { ...notification, read: true } : notification,
    );
    set(() => ({
      notifications: updatedNotifications,
      unreadCount: unreadCount - 1,
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

  resetNotifications: () => {
    const { notifications } = get();
    const readNotifications = notifications.filter((notification) => notification.read);
    set(() => ({
      notifications: readNotifications,
      unreadCount: 0,
    }));
  },
}));

export default useNotification;
