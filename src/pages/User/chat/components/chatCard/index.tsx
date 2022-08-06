import React from 'react';
import styled from 'styled-components';
import Avatar from 'antd/lib/avatar/avatar';
import Card from 'components/Card/card';
import ChatInput from 'pages/User/chat/components/chatInput';
import ChatRecordList from 'pages/User/chat/components/chatRecordList';
import { Content, DescArea, NickName } from './style';

const ContentCard = styled(Card)`
  width: 75%;
`;

const ChatHeadr: React.FC = () => {
  return (
    <Content>
      <Avatar />
      <DescArea>
        <NickName />
      </DescArea>
    </Content>
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
