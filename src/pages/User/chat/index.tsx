import React, { useState } from 'react';
import styled from 'styled-components';
import ChatContext from './context';
import ChatCard from './components/chatCard';
import ContactList from './components/contactList';
import { w } from 'styles/global';

/* 
进入发消息页面的三种方式

1. 直接从个人主页进 无事发生

2. 从其他人主页点发消息进

3. 从小红点消息提示进

*/

const ChatPage = styled.section`
  display: flex;
  justify-content: space-between;
  ${w}
  margin-top: 10vh;
  height: 70vh;
  width: 80vw;
`;

const Chat: React.FC = () => {
  const data = [
    {
      nickname: 'Tizz T',
      content: '测试hahahahdasjdhjaskdhjkwqhjkdadaksjdhasjkdhjskahdjashdjashjkdashdajsd',
      time: '2022-02-11',
      id: `1`,
    },
    { nickname: 'Tizz T', content: '测试', time: '2022-02-11', id: `2` },
    { nickname: 'Tizz T', content: '测试', time: '2022-02-11', id: `3` },
    { nickname: 'Tizz T', content: '测试', time: '2022-02-11', id: `4` },
    { nickname: 'Tizz T', content: '测试', time: '2022-02-11', id: `5` },
    { nickname: 'Tizz T', content: '测试', time: '2022-02-11', id: `6` },
    { nickname: 'Tizz T', content: '测试', time: '2022-02-11', id: `7` },
    { nickname: 'Tizz T', content: '测试', time: '2022-02-11', id: `8` },
    { nickname: 'Tizz T', content: '测试', time: '2022-02-11', id: `9` },
    { nickname: 'Tizz T', content: '测试', time: '2022-02-11', id: `10` },
    { nickname: 'Tizz T', content: '测试', time: '2022-02-11', id: `11` },
    { nickname: 'Tizz T', content: '测试', time: '2022-02-11', id: `12` },
    { nickname: 'Tizz T', content: '测试', time: '2022-02-11', id: `13` },
    { nickname: 'Tizz T', content: '测试', time: '2022-02-11', id: `14` },
    { nickname: 'Tizz T', content: '测试', time: '2022-02-11', id: `15` },
    { nickname: 'Tizz T', content: '测试', time: '2022-02-11', id: `16` },
    { nickname: 'Tizz T', content: '测试', time: '2022-02-11', id: `17` },
    { nickname: 'Tizz T', content: '测试', time: '2022-02-11', id: `18` },
  ];
  const [selectId, setSelectId] = useState('');

  return (
    <ChatContext.Provider value={{ selectId, setSelectId }}>
      <ChatPage>
        <ContactList data={data} />
        <ChatCard />
      </ChatPage>
    </ChatContext.Provider>
  );
};

export default Chat;
