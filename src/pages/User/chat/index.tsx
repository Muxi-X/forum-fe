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
import { Card } from 'antd';
import media from 'styles/media';

interface LocationState {
  id: string;
}
/* 
进入发消息页面的三种方式
\1. 直接从个人主页进 无事发生
\2. 从其他人主页点发消息进 contactsList ++ 且置顶 从别人主页点进来 路由传参 参数是id 然后 
查库 有这个id 把这个id放到第一个 没这个id 就新添这个联系人然后reverse
\3. 从小红点消息提示进 
  拿聊天记录直接set
  一进入就连上WebSocket 因为有消息推送这个需求
  联系人列表需要前端缓存
发消息后
*/
const ChatPage = styled.section`
  display: flex;
  justify-content: space-between;
  ${w}
  height: 70vh;
  max-width: 960px;
  min-width: 375px;
  max-height: 800px;
  ${media.desktop`width: 100vw`}
`;

const Chat: React.FC = () => {
  const chatStore = useChat();
  const {
    userProfile: { id: myId },
  } = useProfile();
  const { setContacts, setSelectedId, contacts, getRecords, setRecords, selectedId } =
    chatStore;
  const { ws, setTip } = useWS();
  const { state } = useLocation();
  const { runAsync } = useRequest(API.user.getUserProfileById.request, { manual: true });
  const { runAsync: getHistory } = useRequest(API.chat.getHistoryById.request, {
    manual: true,
  });
  useEffect(() => {
    // 从别人的主页点发私信的情况 拿id找用户
    if (state !== null && (state as LocationState).id !== `${myId}`) {
      const { id } = state as LocationState; // 从本地搜索目标用户
      Contacts.getContacts(myId as number).then((contacts) => {
        Contacts.searchContact(+id).then((contact) => {
          // 如果有 直接选择该用户
          if (contact) {
            setSelectedId(contact.id as number);
            setContacts(contacts);
          } else {
            // 如果没有该用户 就把该用户信息添加到本地中
            runAsync({ id: +(id as string) }).then((res) => {
              const newContact = { ...res.data, msgRecords: [], userId: myId as number };
              Contacts.getContacts(myId as number).then((contacts) => {
                if (contacts.length !== 0) {
                  setContacts([{ ...res.data, msgRecords: [] }, ...contacts]);
                } else setContacts([{ ...newContact }]);
              });
              Contacts.addContact({ ...newContact });
              setSelectedId(newContact.id as number);
            });
          }
        });
      });
    } else {
      // 主页收到消息通知 ｜ 直接从主页点进
      Contacts.getContacts(myId as number).then((contacts) => {
        if (contacts.length !== 0) {
          if (selectedId !== 0) {
            Contacts.searchContact(selectedId).then((res) => {
              getHistory({ id: selectedId }).then((res) => {
                setRecords(res.data as defs.chat_Message[], selectedId);
              });
            });
          } else {
            setSelectedId(contacts[0].id as number);
            setContacts(contacts);
          }
        } else {
          getHistory({ id: selectedId }).then((msgRes) => {
            runAsync({ id: selectedId }).then((userRes) => {
              const newContact = {
                ...userRes.data,
                msgRecords: msgRes.data,
                userId: myId as number,
              };
              setContacts([{ ...newContact }]);
              Contacts.addContact({ ...newContact });
              setSelectedId(newContact.id as number);
            });
          });
        }
      });
    }
    (ws as WS).ws.onmessage = (e) => {
      const res = JSON.parse(e.data);
      const { time } = res as MsgResponse;
      const newTime = formatYear(time, 'YYYY-MM-DD HH:MM:SS');
      const records = [...getRecords(res.sender), { ...res, time: newTime }];
      setRecords(records, res.sender);
    };
    return () => {
      (ws as WS).ws.onmessage = () => {
        setTip(true);
      };
    };
  }, [myId]);

  return (
    <>
      {contacts.length === 0 ? (
        <Card>暂时还没有联系人哦～</Card>
      ) : (
        <ChatPage>
          <ContactList />
          <ChatCard />
        </ChatPage>
      )}
    </>
  );
};

export default Chat;
