import React, { useState, useEffect } from 'react';
import { Card, List, Badge, Button, Empty, Typography, Modal, message } from 'antd';
import {
  LikeOutlined,
  CommentOutlined,
  StarOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import * as style from './style';
import useNotification, { Notification } from 'store/useNotification';
import useDocTitle from 'hooks/useDocTitle';
import useRequest from 'hooks/useRequest';
import { useNavigate } from 'react-router-dom';
import moment from 'utils/moment';

const Notice: React.FC = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotification();
  const nav = useNavigate();

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'like':
        return <LikeOutlined style={{ color: '#ff4d4f' }} />;
      case 'collection':
        return <StarOutlined style={{ color: '#faad14' }} />;
      case 'comment':
      case 'reply_comment':
        return <CommentOutlined style={{ color: '#1890ff' }} />;
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
      case 'reply_comment':
        return '有人回复了你的评论';
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

  const { run: deleteMessages } = useRequest(API.user.deleteUserPrivateMessage.request, {
    manual: true,
    onError: (error) => {
      console.error('清除通知失败:', error);
    },
  });

  const handleMarkAllRead = () => {
    Modal.confirm({
      title: '确认要全部标记为已读吗？',
      okText: '确认',
      cancelText: '取消',
      okType: 'primary',
      onOk: async () => {
        try {
          markAllAsRead();
          await deleteMessages({}, {});
          message.success('已全部标记为已读');
        } catch (error) {
          console.error('清除通知失败:', error);
          message.error('操作失败，请稍后重试');
        }
      },
    });
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
