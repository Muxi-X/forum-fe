import React, { useEffect, useRef } from 'react';
import useNotification, { Notification } from 'store/useNotification';
import useRequest from 'hooks/useRequest';

const GlobalNotificationListener: React.FC = () => {
  const { addNotifications, resetNotifications } = useNotification();
  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  const { run: getNotifications } = useRequest(
    API.user.getUserPrivateMessageList.request,
    {
      onSuccess: (res) => {
        if (res.data.messages) {
          const newNotifications: Notification[] = res.data.messages
            .map((message: string, index: number) => {
              try {
                const notification = JSON.parse(message);

                if (
                  !notification.post_id ||
                  !notification.type ||
                  !notification.content
                ) {
                  console.error('通知解析错误:', notification);
                }

                return {
                  id: `${notification.post_id}_${notification.type}_${Date.now()}`,
                  postId: notification.post_id,
                  type: notification.type,
                  content: notification.content,
                  read: false,
                  timestamp: Date.now(),
                };
              } catch (error) {
                console.error('通知解析失败:', message, error);
                return null;
              }
            })
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
  }, [getNotifications]);

  return null;
};

export default GlobalNotificationListener;
