import React from 'react';
import styled from 'styled-components';
import Card from 'components/Card/card';
import ContactItem from 'pages/User/chat/components/contactItem';
import { Contact } from '../../type';

interface IProps {
  data: Contact[];
}

const ListCard = styled(Card)`
  width: 25%;
  margin-right: 2vw;
  padding: 0;
`;

const ContactList: React.FC<IProps> = ({ data }) => {
  return (
    <ListCard>
      {data.map((contact) => (
        <ContactItem contact={contact} key={contact.id} />
      ))}
    </ListCard>
  );
};

export default ContactList;
