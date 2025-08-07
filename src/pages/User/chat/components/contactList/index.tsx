import React from 'react';
import styled from 'styled-components';
import useChat from 'store/useChat';
import { Card } from 'antd';
import type { Contact } from 'store/useChat';
import ContactItem from 'pages/User/chat/components/contactItem';

const ListCard = styled(Card)`
  width: 30%;
  margin-right: 1vw;
  overflow-y: auto;
  .ant-card-body {
    padding: 0;
  }
`;

const ContactList: React.FC = () => {
  const chatStore = useChat();
  const { contacts } = chatStore;

  function descSortByTime(contacts: Contact[]) {
    return [...contacts].sort((a, b) => {
      const lastMsgA = a.msgRecords[a.msgRecords.length - 1];
      const lastMsgB = b.msgRecords[b.msgRecords.length - 1];

      const timeA = lastMsgA?.time ? new Date(lastMsgA.time).getTime() : 0;
      const timeB = lastMsgB?.time ? new Date(lastMsgB.time).getTime() : 0;

      return timeB - timeA;
    });
  }

  return (
    <ListCard>
      {contacts &&
        contacts.length > 0 &&
        descSortByTime(contacts).map((contact) =>
          contact?.id ? <ContactItem key={contact.id} {...contact} /> : null,
        )}
    </ListCard>
  );
};

export default ContactList;
