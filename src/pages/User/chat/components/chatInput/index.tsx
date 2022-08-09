import React, { useState, useCallback, RefObject } from 'react';
import { Button } from 'antd';
import ChatToolbar from '../chatToolbar';
import * as style from './style';

const ChatInput: React.FC = () => {
  const [message, setMessage] = useState('');

  const handleSendMessage = () => {
    console.log(message);
  };

  const handleSelectEmoji = useCallback((emoji: any) => {
    setMessage((msg) => msg + emoji.native);
  }, []);

  const handleUploadImg = (ref: RefObject<HTMLInputElement>) => {
    if (ref?.current) ref.current.click();
  };

  return (
    <style.InputWrapper>
      <ChatToolbar
        emoji
        img
        onSelectEmoji={handleSelectEmoji}
        onUploadImg={handleUploadImg}
      />
      <style.InputArea
        value={message}
        onChange={(e) => {
          setMessage(e.target.value);
        }}
        placeholder="请输入..."
      />
      <style.ButtonArea>
        <Button onClick={handleSendMessage}>发送</Button>
      </style.ButtonArea>
    </style.InputWrapper>
  );
};

export default ChatInput;
