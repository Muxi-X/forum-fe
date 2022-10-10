import React from 'react';
import styled from 'styled-components';
import { Card } from 'antd';
import ChatInput from 'pages/User/chat/components/chatInput';
import ChatRecordList from 'pages/User/chat/components/chatRecordList';
import * as style from './style';

const ContentCard = styled(Card)`
  width: 75%;
  overflow-y: scroll;
  padding-top: 1em;
  .ant-card-body {
    padding: 10px;
  }
`;

const ChatCard: React.FC = () => {
  return (
    <ContentCard>
      <ChatRecordList />
      <ChatInput />
    </ContentCard>
  );
};

export default ChatCard;
