import React from 'react';
import Avatar from 'components/Avatar/avatar';
import * as style from './style';
import { MessageItemProps } from './type';

const MessageItem: React.FC<MessageItemProps> = ({ content, time }) => {
  return (
    <style.MessageItem>
      <Avatar />
      <style.Message></style.Message>
    </style.MessageItem>
  );
};

const ChatRecordList: React.FC = () => {
  return <style.RecordList>聊天记录</style.RecordList>;
};

export default ChatRecordList;
