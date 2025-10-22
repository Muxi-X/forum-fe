import React, { useState, useEffect } from 'react';
import { Card, List, Badge, Button, Empty, Typography } from 'antd';
import {
  LikeOutlined,
  CommentOutlined,
  StarOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import * as style from './style';
import useNotification, { Notification } from 'store/useNotification';
import useDocTitle from 'hooks/useDocTitle';
import { useNavigate } from 'react-router-dom';
import moment from 'utils/moment';

const Notice: React.FC = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification } =
    useNotification();
  const nav = useNavigate();

  useEffect(() => {
    // 删除已读的通知
    const hasReadNotifications = notifications.some((notification) => notification.read);
    if (hasReadNotifications) {
      deleteNotification();
    }
  }, [notifications, deleteNotification]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'like':
        return <LikeOutlined style={{ color: '#ff4d4f' }} />;
      case 'comment':
        return <CommentOutlined style={{ color: '#1890ff' }} />;
      case 'collection':
        return <StarOutlined style={{ color: '#faad14' }} />;
      default:
        return <EyeOutlined />;
    }
  };

  const getNotificationText = (type: string) => {
    switch (type) {
      case 'like':
        return '有人点赞了你的帖子';
      case 'comment':
        return '有人评论了你的帖子';
      case 'collection':
        return '有人收藏了你的帖子';
      default:
        return '不是哥们这能被你整出来啊';
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    nav(`/article/${notification.postId}`);
  };

  const handleMarkAllRead = () => {
    markAllAsRead();
  };

  useDocTitle('长目飞耳 - 茶馆');
  return (
    <style.Wrapper>
      <Card
        title={
          <style.HeaderContainer>
            <style.title>通知中心</style.title>
            {unreadCount > 0 && (
              <Button type="primary" size="small" onClick={handleMarkAllRead}>
                全部标记为已读
              </Button>
            )}
          </style.HeaderContainer>
        }
      >
        {notifications.length === 0 ? (
          <Empty description="暂时还没有通知哦 :D" />
        ) : (
          <List
            itemLayout="horizontal"
            dataSource={[...notifications].sort((a, b) => b.timestamp - a.timestamp)}
            renderItem={(notification) => (
              <style.ListItem
                key={notification.id}
                onClick={() => handleNotificationClick(notification)}
              >
                <List.Item.Meta
                  avatar={
                    <Badge dot={!notification.read}>
                      {getNotificationIcon(notification.type)}
                    </Badge>
                  }
                  title={
                    <style.ListItemTitle>
                      <Typography.Text strong={!notification.read}>
                        {getNotificationText(notification.type)}
                      </Typography.Text>
                      <Typography.Text type="secondary" style={{ fontSize: '12px' }}>
                        {moment(notification.timestamp).fromNow()}
                      </Typography.Text>
                    </style.ListItemTitle>
                  }
                  description={
                    <div>
                      <Typography.Text>{notification.content}</Typography.Text>
                      <br />
                      <Typography.Text type="secondary" style={{ fontSize: '12px' }}>
                        快去看看吧 :D
                      </Typography.Text>
                    </div>
                  }
                />
              </style.ListItem>
            )}
          />
        )}
      </Card>
    </style.Wrapper>
  );
};

export default Notice;
