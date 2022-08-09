import React from 'react';
import styled from 'styled-components';
import Avatar from 'antd/lib/avatar/avatar';
import Card from 'components/Card/card';
import ChatInput from 'pages/User/chat/components/chatInput';
import ChatRecordList from 'pages/User/chat/components/chatRecordList';
import * as style from './style';

const ContentCard = styled(Card)`
  width: 75%;
  overflow-x: visible;
`;

const ChatHeadr: React.FC = () => {
  return (
    <style.Content>
      <Avatar />
      <style.DescArea>
        <style.NickName />
      </style.DescArea>
    </style.Content>
  );
};

const ChatCard: React.FC = () => {
  return (
    <ContentCard>
      <ChatRecordList />
      <ChatInput />
    </ContentCard>
  );
};

export default ChatCard;
