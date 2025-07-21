import React from 'react';
import styled from 'styled-components';
import useChat from 'store/useChat';
import { Card } from 'antd';
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

  return (
    <ListCard>
      {contacts
        ? contacts
            .sort((a, b) => {
              const lastMsgA = a.msgRecords[a.msgRecords.length - 1];
              const lastMsgB = b.msgRecords[b.msgRecords.length - 1]; //获取最后一条消息

              const timeA = lastMsgA?.time ? new Date(lastMsgA.time).getTime() : 0;
              const timeB = lastMsgB?.time ? new Date(lastMsgB.time).getTime() : 0; //转换为时间戳

              return timeB - timeA;
            })
            .map((contact, i) => <ContactItem key={contact.id} {...contact} />) //对contact根据日期降序排序
        : null}
    </ListCard>
  );
};

export default ContactList;
