import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { Input, message } from 'antd';
import { useLocation } from 'react-router-dom';
import MobileShell from '../components/MobileShell';
import EmptyState from '../components/EmptyState';
import { mobilePalette, PrimaryButton } from '../styles';
import { mobileApi, MobileUser } from '../api';
import useProfile from 'store/useProfile';
import useWS from 'store/useWS';
import WS, { MsgResponse } from 'utils/WS';
import moment from 'utils/moment';

const Wrap = styled.div`
  display: grid;
  grid-template-rows: 1fr auto;
  min-height: calc(100vh - 52px);
  background: ${mobilePalette.bg};
`;

const Messages = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 14px;
`;

const Bubble = styled.div<{ mine?: boolean }>`
  max-width: 78%;
  align-self: ${(props) => (props.mine ? 'flex-end' : 'flex-start')};
  padding: 10px 12px;
  border-radius: 8px;
  background: ${(props) => (props.mine ? mobilePalette.orange : '#fff')};
  color: ${(props) => (props.mine ? '#fff' : mobilePalette.ink)};
  box-shadow: 0 4px 12px rgba(31, 35, 41, 0.05);
`;

const Time = styled.div`
  margin-bottom: 4px;
  color: ${mobilePalette.muted};
  font-size: 11px;
  text-align: center;
`;

const Composer = styled.div`
  display: grid;
  grid-template-columns: 1fr 72px;
  gap: 8px;
  padding: 10px 12px calc(10px + env(safe-area-inset-bottom));
  background: ${mobilePalette.paper};
  border-top: 1px solid ${mobilePalette.line};
`;

const Chat: React.FC = () => {
  const { state } = useLocation();
  const targetId = Number((state as any)?.id || 0);
  const { userProfile } = useProfile();
  const { ws, setWS } = useWS();
  const [target, setTarget] = useState<MobileUser | null>(null);
  const [records, setRecords] = useState<MsgResponse[]>([]);
  const [text, setText] = useState('');

  const myId = userProfile.id || Number(localStorage.getItem('userId')) || 0;
  const title = useMemo(() => target?.name || '私信', [target]);

  useEffect(() => {
    if (!targetId) return;
    mobileApi.user.profile(targetId).then((res) => {
      if (res.code === 0) setTarget(res.data);
    });
    mobileApi.chat.history(targetId, { limit: 50 }).then((res) => {
      if (res.code === 0 && Array.isArray(res.data))
        setRecords(res.data.reverse() as MsgResponse[]);
    });
  }, [targetId]);

  useEffect(() => {
    let socket = ws;
    if (!socket) {
      socket = new WS(localStorage.getItem('token') || '');
      setWS(socket);
    }
    if (socket.ws) {
      socket.ws.onmessage = (event) => {
        const data = JSON.parse(event.data) as MsgResponse;
        if (data.sender_id === targetId || data.receiver_id === targetId) {
          setRecords((prev) => [...prev, data]);
        }
      };
    }
  }, [ws, targetId]);

  const send = () => {
    if (!text.trim() || !targetId) return;
    const payload = {
      target_user_id: targetId,
      content: text.trim(),
      type_name: 'str' as const,
      time: moment(Date.now()).format('YYYY-MM-DD HH:mm:ss'),
    };
    if (!ws?.ws || ws.ws.readyState !== WebSocket.OPEN) {
      message.warning('连接尚未建立');
      return;
    }
    ws.send(payload);
    setRecords((prev) => [
      ...prev,
      {
        sender_id: myId,
        receiver_id: targetId,
        content: payload.content,
        type_name: payload.type_name,
        time: payload.time,
      },
    ]);
    setText('');
  };

  if (!targetId) {
    return (
      <MobileShell title="私信" back tabs={false}>
        <EmptyState text="请选择聊天对象" />
      </MobileShell>
    );
  }

  return (
    <MobileShell title={title} back tabs={false}>
      <Wrap>
        <Messages>
          {records.length ? (
            records.map((record, index) => (
              <React.Fragment key={`${record.time}-${index}`}>
                <Time>{record.time}</Time>
                <Bubble mine={record.sender_id === myId}>{record.content}</Bubble>
              </React.Fragment>
            ))
          ) : (
            <EmptyState text="开始聊天吧" />
          )}
        </Messages>
        <Composer>
          <Input
            value={text}
            onChange={(event) => setText(event.target.value)}
            onPressEnter={send}
          />
          <PrimaryButton onClick={send}>发送</PrimaryButton>
        </Composer>
      </Wrap>
    </MobileShell>
  );
};

export default Chat;
