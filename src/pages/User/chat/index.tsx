import React, { useEffect, useState } from 'react';
import { message } from 'antd';
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
import WS, { Message, MsgResponse } from 'utils/WS';
import { formatYear } from 'utils/moment';
import { Card } from 'antd';
import media from 'styles/media';
import useDocTitle from 'hooks/useDocTitle';
import EmptyCard from 'components/EmptyCard';
import Loading from 'components/Loading';

interface LocationState {
  id: string;
}
/* 
进入发消息页面的三种方式
\1. 直接从主页进 拿原本的缓存就行
\2. 从其他人主页点发消息进 contactsList ++ 且置顶 从别人主页点进来 路由传参 参数是id 然后 
查库 有这个id 把这个id放到第一个 没这个id 就新添这个联系人然后reverse
\3. 从小红点消息提示进 
  拿聊天记录直接set
  一进入就连上WebSocket 因为有消息推送这个需求
  联系人列表需要前端缓存
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
  const { userProfile } = useProfile();
  const myId = userProfile.id as number;
  const name = userProfile.name;
  const { setContacts, setSelectedId, contacts, getRecords, setRecords, selectedId } =
    chatStore;
  const { ws, setTip, setWS } = useWS();
  const { state } = useLocation();
  const { runAsync } = useRequest(API.user.getUserProfileById.request, { manual: true });
  const { runAsync: getHistory } = useRequest(API.chat.getHistoryById.request, {
    manual: true,
  });

  const [loading, setLoading] = useState(true);

  const webSocketInit = () => {
    const token = localStorage.getItem('token') as string;
    const WebSocket = new WS(token);
    if (WebSocket.ws) {
      WebSocket.ws.onmessage = (e) => {
        const res = JSON.parse(e.data) as MsgResponse;
        const newTime = formatYear(res.time, 'YYYY-MM-DD HH:MM:SS');
        const records = [...getRecords(res.sender_id, myId), { ...res, time: newTime }];
        setRecords(records, res.sender_id, myId);
      };
    }
    setWS(WebSocket);
    console.log(WebSocket);
  };

  const messageMerge = (messages: (MsgResponse | Message)[]) => {
    const mergedMessages = new Map<string, MsgResponse | Message>();
    for (const message of messages) {
      const key = `${message.time}-${message.content}`;
      if (!mergedMessages.has(key)) {
        mergedMessages.set(key, message);
      }
    }

    return Array.from(mergedMessages.values()).sort((a, b) => {
      const timeA = new Date(a.time).getTime();
      const timeB = new Date(b.time).getTime();
      return timeA - timeB;
    });
  };

  useEffect(() => {
    // // 从别人的主页点发私信的情况 拿id找用户
    // if (state !== null && (state as LocationState).id !== `${myId}`) {
    //   const { id } = state as LocationState; // 从本地搜索目标用户
    //   Contacts.getContacts(myId as number).then((contacts) => {
    //     Contacts.searchContact(+id).then((contact) => {
    //       // 如果有 直接选择该用户
    //       if (contact) {
    //         setSelectedId(contact.id as number);
    //         setContacts(contacts);
    //       } else {
    //         // 如果没有该用户 就把该用户信息添加到本地中
    //         runAsync({ id: +(id as string) }).then((res) => {
    //           const newContact = { ...res.data, msgRecords: [], userId: myId as number };
    //           Contacts.getContacts(myId as number).then((contacts) => {
    //             if (contacts.length !== 0) {
    //               setContacts([{ ...res.data, msgRecords: [] }, ...contacts]);
    //             } else setContacts([{ ...newContact }]);
    //           });
    //           Contacts.addContact({ ...newContact });
    //           setSelectedId(newContact.id as number);
    //         });
    //       }
    //     });
    //     setLoading(false);
    //   });
    // } else {
    //   // 主页收到消息通知 ｜ 直接从主页点进
    //   Contacts.getContacts(myId as number).then((contacts) => {
    //     // selected === 0 说明没有新消息
    //     if (selectedId === 0) {
    //       // 之前有联系人列表
    //       if (contacts.length !== 0) {
    //         setSelectedId(contacts[0].id as number);
    //         setContacts(contacts);
    //       }
    //     } else {
    //       // 有新消息的情况
    //       Contacts.searchContact(selectedId).then((contact) => {
    //         getHistory({ id: selectedId }).then((res) => {
    //           if (contact) {
    //             console.log(res.data);
    //             setRecords(res.data.reverse() as MsgResponse[], selectedId);
    //           } else {
    //             runAsync({ id: selectedId }).then((userRes) => {
    //               const newContact = {
    //                 ...userRes.data,
    //                 msgRecords: res.data.reverse() as MsgResponse[],
    //                 userId: myId as number,
    //               };
    //               setContacts([{ ...newContact }]);
    //               Contacts.addContact({ ...newContact });
    //               setSelectedId(newContact.id as number);
    //             });
    //           }
    //         });
    //       });
    //     }
    //     setLoading(false);
    //   });
    // }

    const initContacts = async () => {
      if (!myId) return;
      try {
        // 从别人的主页点发私信的情况 拿 id 找用户
        if (state !== null && (state as LocationState).id !== `${myId}`) {
          const { id } = state as LocationState;
          // 从本地搜索目标用户
          const localContacts = await Contacts.getContacts(myId);
          const contact = await Contacts.searchContact(+id, myId);
          if (contact) {
            // 如果有，直接选择该用户
            setContacts(localContacts);
            setSelectedId(contact.id as number);
          } else {
            // 如果没有该用户，就从接口拿信息并添加到本地中
            const res = await runAsync({ id: +(id as string) });
            const newContact = {
              ...res.data,
              msgRecords: [],
              userId: myId as number,
              lastModified: Date.now(),
            };
            const localContacts = await Contacts.getContacts(myId as number);
            if (localContacts.length !== 0) {
              setContacts([...localContacts, { ...newContact }]);
            } else {
              setContacts([{ ...newContact }]);
            }

            await Contacts.addContact({ ...newContact });
            setSelectedId(newContact.id as number);
          }

          setLoading(false);
        } else {
          // 主页收到消息通知 ｜ 直接从主页点进
          const localContacts = (await Contacts.getContacts(myId as number)) || [];
          // selected === 0 说明没有新消息
          if (selectedId === 0) {
            if (localContacts.length !== 0) {
              // 之前有联系人列表
              setContacts(localContacts);
              setTimeout(() => {
                setSelectedId(localContacts[0].id as number);
              }, 0);
            }
          } else {
            // 有新消息的情况
            const contact = await Contacts.searchContact(selectedId, +myId);
            const localMessages = getRecords(selectedId, myId);
            const res = await getHistory({ id: selectedId });

            if (contact) {
              if (res.data) {
                const newData = [...res.data].reverse() as MsgResponse[];
                const mergedMessages = messageMerge([...localMessages, ...newData]);
                setRecords(mergedMessages, selectedId, myId);
                await Contacts.putRecords(mergedMessages, selectedId, myId as number);
              } else {
                setRecords(localMessages ?? [], selectedId, myId);
              }
              const updatedContacts = await Contacts.getContacts(myId as number);
              setContacts(updatedContacts);
            } else {
              const userRes = await runAsync({ id: selectedId });
              const msgRecords = Array.isArray(res.data) ? res.data.reverse() : [];
              const newContact = {
                ...userRes.data,
                msgRecords: msgRecords as MsgResponse[],
                userId: myId as number,
                lastModified: Date.now(),
              };
              setContacts([...localContacts, { ...newContact }]);
              await Contacts.addContact({ ...newContact });
              setSelectedId(newContact.id as number);
            }
          }
          setLoading(false);
        }
      } catch (err) {
        console.log('获取聊天记录错误:', err);
        message.error('获取聊天记录错误');
      }
    };
    initContacts();

    if (ws) {
      (ws as WS).ws!.onmessage = (e) => {
        const res = JSON.parse(e.data) as MsgResponse;
        const newTime = formatYear(res.time, 'YYYY-MM-DD HH:MM:SS');
        const records = [...getRecords(res.sender_id, myId), { ...res, time: newTime }];
        setRecords(records, res.sender_id, myId);
      };
    } else {
      webSocketInit();
    }

    name ? useDocTitle(`${name} - 轻风高谊 - 茶馆`) : useDocTitle(`轻风高谊 - 茶馆`);

    return () => {
      if (ws)
        (ws as WS).ws!.onmessage = (res) => {
          const data: MsgResponse = JSON.parse(res.data);
          if (typeof data?.sender_id === 'number') {
            setTip(true);
            setSelectedId(data.sender_id);
          }
        };
    };
  }, [myId, ws, name]);

  return (
    <>
      {loading ? (
        <Loading />
      ) : contacts.length === 0 ? (
        <EmptyCard>暂时还没有联系人哦～</EmptyCard>
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
