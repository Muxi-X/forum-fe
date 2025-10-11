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
          const newNotifications: Notification[] = res.data.messages.map(
            (message: string, index: number) => {
              const msgData = JSON.parse(message);
              return {
                id: `${msgData.post_id}_${msgData.type}_${index}`,
                postId: msgData.post_id,
                type: msgData.type,
                content: msgData.content,
                read: false,
                timestamp: Date.now(),
              };
            },
          );
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
  }, []);

  return null;
};

export default GlobalNotificationListener;
