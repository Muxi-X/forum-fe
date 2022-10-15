import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Image } from 'antd';
import useChat, { Contact } from 'store/useChat';
import useProfile from 'store/useProfile';
import { MsgResponse, Message } from 'utils/WS';
import Avatar from 'components/Avatar/avatar';
import * as style from './style';

interface IProps {
  msg: MsgResponse | Message;
  contact: Contact;
}

function isMessage(msg: MsgResponse | Message): msg is Message {
  return (msg as Message).target_user_id !== undefined;
}

const RecordImage = styled(Image)`
  max-width: 200px;
  max-height: 150px;
`;

const ChatAvatar = styled(Avatar)<style.isMyMessage>`
  margin: 5px;
  margin-right: ${(props) => (props.myMessage ? '15px' : '20px')};
  margin-left: ${(props) => (props.myMessage ? '20px' : '5px')};
`;

const MessageItem: React.FC<IProps> = ({ msg, contact }) => {
  const profileStore = useProfile();
  const {
    userProfile: { avatar, id },
  } = profileStore;

  const isMy = isMessage(msg) ? true : msg.sender === id;

  return (
    <style.MessageWrapper myMessage={isMy}>
      <style.MessageItem myMessage={isMy}>
        <style.Message>
          <style.MessageTime myMessage={isMy}>{msg.time}</style.MessageTime>
          {msg.type_name === 'str' ? (
            <style.MessageContent myMessage={isMy}>{msg.content}</style.MessageContent>
          ) : (
            <RecordImage src={msg.content} />
          )}
        </style.Message>
        <ChatAvatar
          height={40}
          width={40}
          src={isMy ? avatar : contact.avatar}
          userId={isMy ? id : contact.id}
          myMessage={isMy}
        />
      </style.MessageItem>
    </style.MessageWrapper>
  );
};

const ChatRecordList: React.FC = () => {
  const chatStore = useChat();
  const messageEnd = useRef<HTMLUListElement>(null);
  const { getContact, getRecords, selectedId } = chatStore;
  const records = getRecords(selectedId);
  const contact = getContact(selectedId);

  const scrollBottom = () => {
    if (messageEnd?.current) {
      messageEnd.current.scrollTop = messageEnd.current.scrollHeight + 150;
    }
  };

  useEffect(() => {
    scrollBottom();
  });

  return (
    <style.RecordList>
      <style.Header>聊天记录</style.Header>
      <style.Items ref={messageEnd}>
        {records.map((record, i) => (
          <MessageItem key={i} msg={record} contact={contact} />
        ))}
      </style.Items>
    </style.RecordList>
  );
};

export default ChatRecordList;
