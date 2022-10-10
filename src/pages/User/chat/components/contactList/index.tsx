import React from 'react';
import styled from 'styled-components';
import useChat from 'store/useChat';
import { Card } from 'antd';
import ContactItem from 'pages/User/chat/components/contactItem';

const ListCard = styled(Card)`
  width: 25%;
  margin-right: 2vw;
  .ant-card-body {
    padding: 0;
  }
`;

const ContactList: React.FC = () => {
  const chatStore = useChat();
  const { contacts } = chatStore;

  return (
    <ListCard>
      {contacts
        ? contacts.map((contact, i) => <ContactItem key={contact.id} {...contact} />)
        : null}
    </ListCard>
  );
};

export default ContactList;
