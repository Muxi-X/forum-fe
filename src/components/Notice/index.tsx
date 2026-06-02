import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import useNotification, { Notification } from 'store/useNotification';
import useRequest from 'hooks/useRequest';
import { hasAuthToken, isLoginRoute } from 'utils/auth';

type RawNotification = {
  id?: string;
  post_id?: number | string;
  comment_id?: number | string;
  type?: Notification['type'];
  content?: string;
  post_title?: string;
  comment_content?: string;
};

const parseNotification = (message: unknown, index: number): Notification | null => {
  let notification: RawNotification;
  if (typeof message === 'string') {
    try {
      notification = JSON.parse(message);
    } catch (error) {
      console.error('通知解析失败:', message, error);
      return null;
    }
  } else if (message && typeof message === 'object') {
    notification = message as RawNotification;
  } else {
    return null;
  }

  const postId = Number(notification.post_id);
  if (!postId || !notification.type) return null;

  return {
    id: notification.id || `${postId}_${notification.type}_${index}`,
    postId,
    type: notification.type,
    content:
      notification.content ||
      notification.comment_content ||
      notification.post_title ||
      '',
    read: false,
    timestamp: Date.now(),
  };
};

const GlobalNotificationListener: React.FC = () => {
  const { addNotifications, resetNotifications } = useNotification();
  const pollingRef = useRef<NodeJS.Timeout | null>(null);
  const { pathname } = useLocation();

  const { run: getNotifications } = useRequest(
    API.user.getUserPrivateMessageList.request,
    {
      manual: true,
      onSuccess: (res) => {
        if (res.data.messages) {
          const newNotifications: Notification[] = res.data.messages
            .map(parseNotification)
            .filter((n): n is Notification => n !== null);

          // 每次轮询重置未读数据并添加新数据
          resetNotifications();
          addNotifications(newNotifications);
        }
      },
      onError: (error) => {
        console.error('获取通知失败:', error);
      },
    },
  );

  useEffect(() => {
    if (isLoginRoute(pathname) || !hasAuthToken()) {
      resetNotifications();
      return;
    }

    // 立即获取一次
    getNotifications({}, {});

    // 每12秒轮询一次
    pollingRef.current = setInterval(() => {
      getNotifications({}, {});
    }, 12000);

    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
    };
  }, [getNotifications, pathname]);

  return null;
};

export default GlobalNotificationListener;
