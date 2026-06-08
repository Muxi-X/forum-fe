import React, { useState, useEffect } from 'react';
import { Badge } from 'antd';
import styled from 'styled-components';
import { formatYear } from 'utils/moment';
import { useDeviceType } from 'hooks/useDeviceType';
import useChat, { Contact } from 'store/useChat';
import useNotification from 'store/useNotification';
import Avatar from 'components/Avatar/avatar';
import { markChatConversationRead } from 'mobile/chatSync';
import * as style from './style';

const Wrapper = styled(Badge)`
  width: 100%;
`;

const ContactItem: React.FC<Contact> = ({ name, id, msgRecords, avatar }) => {
  const chatStore = useChat();
  const { setSelectedId, selectedId } = chatStore;
  const { chatUnread, markChatRead } = useNotification();
  const isMobile = useDeviceType() === 'phone';

  const handleSelect = (id: number) => {
    setSelectedId(id);
    markChatRead(id);
    markChatConversationRead(id).catch((err) => console.error('标记私信已读失败:', err));
  };

  const getContent = () => {
    if (msgRecords[len - 1].type_name === 'file') return '[图片]';
    else return msgRecords[len - 1].content;
  };

  const len = msgRecords ? msgRecords.length : 0;
  const time = len !== 0 ? msgRecords[len - 1].time : '';

  return (
    <Wrapper dot={Boolean(id && chatUnread[id])} offset={[-8, 10]}>
      <style.Item
        onClick={() => {
          handleSelect(id as number);
        }}
        selected={selectedId === id}
      >
        {isMobile ? (
          <style.Message>
            <Avatar width="3em" height="3em" userId={id} src={avatar as string} />
            <style.Info>
              <style.ChatDate>
                {len ? formatYear(time as string, 'MM-DD') : ''}
              </style.ChatDate>
              <style.Nickname>{name}</style.Nickname>
              <style.Content>{len ? getContent() : ''}</style.Content>
            </style.Info>
          </style.Message>
        ) : (
          <>
            <style.Message>
              <Avatar width="3em" height="3em" userId={id} src={avatar as string} />
              <style.Info>
                <style.Nickname>{name}</style.Nickname>
                <style.Content>{len ? getContent() : ''}</style.Content>
              </style.Info>
            </style.Message>
            <style.ChatDate>
              {len ? formatYear(time as string, 'MM-DD') : ''}
            </style.ChatDate>
          </>
        )}
      </style.Item>
    </Wrapper>
  );
};

export default ContactItem;
