import React from 'react';
import { Badge } from 'antd';
import styled from 'styled-components';
import { formatYear } from 'utils/moment';
import useChat, { Contact } from 'store/useChat';
import Avatar from 'components/Avatar/avatar';
import * as style from './style';

const Wrapper = styled(Badge)`
  width: 100%;
`;

const ContactItem: React.FC<Contact> = ({ name, id, msgRecords, avatar }) => {
  const chatStore = useChat();
  const { setSelectedId, selectedId } = chatStore;
  const handleSelect = (id: number) => {
    setSelectedId(id);
  };

  const getContent = () => {
    if (msgRecords[len - 1].type_name === 'file') return '[图片]';
    else return msgRecords[len - 1].content;
  };

  const len = msgRecords.length;
  const time = msgRecords[len - 1].time;

  return (
    <Wrapper count={5} offset={[-12, 12]} size="small">
      <style.Item
        onClick={() => {
          handleSelect(id as number);
        }}
        selected={selectedId === id}
      >
        <style.Message>
          <Avatar width="3em" height="3em" userId={id} src={avatar as string} />
          <style.Info>
            <style.Nickname>{name}</style.Nickname>
            <style.Content>{len ? getContent() : ''}</style.Content>
          </style.Info>
        </style.Message>
        <style.ChatDate>{len ? formatYear(time as string, 'MM-DD') : ''}</style.ChatDate>
      </style.Item>
    </Wrapper>
  );
};

export default ContactItem;
