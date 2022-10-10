import React, { useState, useEffect } from 'react';
import { Button } from 'antd';
import moment from 'utils/moment';
import useChat from 'store/useChat';
import useWS from 'store/useWS';
import { Message } from 'utils/WS';
import Contacts from 'utils/db_chat';
import ChatToolbar from '../chatToolbar';
import * as style from './style';

const cloneMap = (map: Map<number, string>) => {
  const newMap = new Map();
  map.forEach((val, key) => {
    newMap.set(key, val);
  });
  return newMap;
};

const ChatInput: React.FC = () => {
  const [message, setMessage] = useState<Map<number, string>>(new Map());
  const chatStore = useChat();

  const { selectedId, setRecords, getRecords, contacts } = chatStore;
  const { ws } = useWS();

  useEffect(() => {
    const map = new Map();
    for (const contact of contacts) {
      map.set(contact.id, '');
    }
    setMessage(map);
  }, []);

  const handleSendMessage = () => {
    const newRecord: Message = {
      content: message?.get(selectedId) as string,
      target_user_id: selectedId,
      type_name: 'str',
      time: moment(new Date()).format('MM-DD HH:MM:ss'),
    };
    const records = [...getRecords(selectedId), newRecord];
    setRecords(records, selectedId);
    setMessage(cloneMap(message)?.set(selectedId, ''));
    Contacts.putRecords(records, selectedId);
    ws?.send(newRecord);
  };

  const handleSelectEmoji = (emoji: any) => {
    const map = cloneMap(message);
    map.set(selectedId, map.get(selectedId) + emoji.native);
    setMessage(map);
  };

  const handleUploadImg = (imgData: string) => {
    const newRecord: Message = {
      content: imgData,
      target_user_id: selectedId,
      type_name: 'file',
      time: moment(new Date()).format('MM-DD HH:MM:ss'),
    };
    const records = [...getRecords(selectedId), newRecord];
    setRecords(records, selectedId);
    Contacts.putRecords(records, selectedId);
    ws?.send(newRecord);
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
        value={message.get(selectedId)}
        onChange={(e) => {
          setMessage(cloneMap(message)?.set(selectedId, e.target.value));
        }}
        onKeyDown={(e) => {
          const ctrlKey = e.ctrlKey || e.metaKey;
          if (ctrlKey && e.key === 'Enter') handleSendMessage();
        }}
        placeholder="请输入..."
      />
      <style.ButtonArea>
        <style.Tips>
          {/windows|win32/i.test(navigator.userAgent)
            ? '按 CTRL+ENTER 发送'
            : '按 CMD+ENTER 发送'}
        </style.Tips>
        <Button onClick={handleSendMessage}>发送</Button>
      </style.ButtonArea>
    </style.InputWrapper>
  );
};

export default ChatInput;
