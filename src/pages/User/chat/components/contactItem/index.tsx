import React, { useContext } from 'react';
import ChatContext from 'pages/User/chat/context';
import Avatar from 'components/Avatar/avatar';
import { Contact } from 'pages/User/chat/type';
import * as style from './style';

interface IProps {
  contact: Contact;
}

const ContactItem: React.FC<IProps> = ({ contact }) => {
  const { selectId, setSelectId } = useContext(ChatContext);

  const handleSelect = (id: string) => {
    setSelectId(id);
  };

  return (
    <style.Item
      onClick={() => {
        handleSelect(contact.id as string);
      }}
      selected={selectId === contact.id}
    >
      <style.Message>
        <Avatar width="3em" height="3em" />
        <style.Info>
          <style.Nickname>{contact.nickname}</style.Nickname>
          <style.Content>{contact.content}</style.Content>
        </style.Info>
      </style.Message>
      <style.ChatDate>{contact.time}</style.ChatDate>
    </style.Item>
  );
};

export default ContactItem;
