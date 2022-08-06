import React from 'react';
import { Button } from 'antd';
import ChatToolbar from '../chatToolbar';
import * as style from './style';

const ChatInput: React.FC = () => {
  return (
    <style.InputWrapper>
      <ChatToolbar />
      <style.InputArea placeholder="请输入..." />
      <style.ButtonArea>
        <Button>发送</Button>
      </style.ButtonArea>
    </style.InputWrapper>
  );
};

export default ChatInput;
