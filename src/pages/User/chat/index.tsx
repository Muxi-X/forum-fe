import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useLocation } from 'react-router';
import useRequest from 'hooks/useRequest';
import useChat from 'store/useChat';
import useProfile from 'store/useProfile';
import ChatCard from './components/chatCard';
import ContactList from './components/contactList';
import useWS from 'store/useWS';
import Contacts from 'utils/db_chat';
import { w } from 'styles/global';
import WS, { MsgResponse } from 'utils/WS';
import { formatYear } from 'utils/moment';

interface LocationState {
  id: string;
}
/* 
进入发消息页面的三种方式

1. 直接从个人主页进 无事发生

2. 从其他人主页点发消息进 contactsList ++ 且置顶 从别人主页点进来 路由传参 参数是id 然后 
查库 有这个id 把这个id放到第一个 没这个id 就新添这个联系人然后reverse

3. 从小红点消息提示进   通过消息提示更改

  一进入就连上WebSocket 因为有消息推送这个需求
  联系人列表需要前端缓存

发消息后

*/

const ChatPage = styled.section`
  display: flex;
  justify-content: space-between;
  ${w}
  height: 70vh;
  width: 80vw;
`;

const Chat: React.FC = () => {
  const chatStore = useChat();
  const {
    userProfile: { id: myId },
  } = useProfile();
  const { setContacts, setSelectedId, contacts, getRecords, setRecords } = chatStore;
  const { ws, setTip } = useWS();
  const { state } = useLocation();
  const { runAsync } = useRequest(API.user.getUserProfileById.request, { manual: true });

  // 获取联系人列表
  useEffect(() => {
    Contacts.getContacts().then((contacts) => {
      if (contacts) {
        setSelectedId(contacts[0].id as number);
        setContacts(contacts);
      }
    });
    (ws as WS).ws.onmessage = (e) => {
      const res = JSON.parse(e.data);
      const { time } = res as MsgResponse;
      const newTime = formatYear(time, 'MM-DD HH:MM:SS');
      const records = [...getRecords(res.sender), { ...res, time: newTime }];
      setRecords(records, res.sender);
    };

    return () => {
      (ws as WS).ws.onmessage = () => {
        setTip(true);
      };
    };
  }, []);

  // 对目标用户发起聊天
  useEffect(() => {
    if (state !== null && (state as LocationState).id !== `${myId}`) {
      const { id } = state as LocationState;
      Contacts.searchContact(+id).then((contact) => {
        if (contact) {
          setSelectedId(contact.id as number);
        } else {
          runAsync({ id: +(id as string) }).then((res) => {
            const newContact = { ...res.data, msgRecords: [] };
            Contacts.addContact(newContact);
            setContacts([newContact, ...contacts]);
            setSelectedId(newContact.id as number);
          });
        }
      });
    }
  }, []);

  return (
    <ChatPage>
      <ContactList />
      <ChatCard />
    </ChatPage>
  );
};

export default Chat;
