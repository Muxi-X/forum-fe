import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import useNotification from 'store/useNotification';
import {
  notificationPollIntervalMs,
  refreshNotificationStore,
} from 'mobile/notificationSync';
import { hasAuthToken, isLoginRoute } from 'utils/auth';

const GlobalNotificationListener: React.FC = () => {
  const { resetNotifications } = useNotification();
  const pollingRef = useRef<NodeJS.Timeout | null>(null);
  const { pathname } = useLocation();

  useEffect(() => {
    if (isLoginRoute(pathname) || !hasAuthToken()) {
      resetNotifications();
      return;
    }

    const getNotifications = () => {
      refreshNotificationStore().catch((error) => {
        console.error('获取通知失败:', error);
      });
    };

    getNotifications();
    pollingRef.current = setInterval(() => {
      getNotifications();
    }, notificationPollIntervalMs);

    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
    };
  }, [pathname, resetNotifications]);

  return null;
};

export default GlobalNotificationListener;
