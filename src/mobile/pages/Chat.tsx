import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { Input, message } from 'antd';
import { useLocation, useSearchParams } from 'react-router-dom';
import MobileShell from '../components/MobileShell';
import EmptyState from '../components/EmptyState';
import { mobilePalette, mobileRadius, PrimaryButton } from '../styles';
import { mobileApi, MobileUser } from '../api';
import useProfile from 'store/useProfile';
import useWS from 'store/useWS';
import WS, { MsgResponse } from 'utils/WS';
import moment from 'utils/moment';

const Wrap = styled.div`
  display: grid;
  grid-template-rows: 1fr auto;
  min-height: calc(100dvh - 56px - env(safe-area-inset-top));
  background: ${mobilePalette.bg};
`;

const Messages = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 14px 14px 18px;
  overflow-y: auto;
`;

const Bubble = styled.div<{ mine?: boolean }>`
  max-width: 78%;
  align-self: ${(props) => (props.mine ? 'flex-end' : 'flex-start')};
  padding: 10px 13px;
  border-radius: ${(props) => (props.mine ? '18px 18px 6px 18px' : '18px 18px 18px 6px')};
  background: ${(props) =>
    props.mine ? 'linear-gradient(135deg, #ffc641, #fe9800)' : '#fff'};
  color: ${(props) => (props.mine ? '#fff' : mobilePalette.ink)};
  box-shadow: 0 8px 22px rgba(31, 35, 41, 0.06);
  line-height: 1.55;
  word-break: break-word;
`;

const Time = styled.div`
  margin-bottom: 4px;
  color: ${mobilePalette.muted};
  font-size: 11px;
  text-align: center;
`;

const Composer = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) 72px;
  gap: 8px;
  padding: 10px 12px calc(10px + env(safe-area-inset-bottom));
  background: rgba(255, 255, 255, 0.9);
  border-top: 1px solid rgba(60, 60, 67, 0.08);
  backdrop-filter: blur(18px);
  .ant-input {
    height: 42px;
    border-radius: ${mobileRadius.pill};
    border-color: rgba(60, 60, 67, 0.1);
  }
  button {
    height: 42px;
  }
`;

const Chat: React.FC = () => {
  const { state } = useLocation();
  const [searchParams] = useSearchParams();
  const targetId = Number(searchParams.get('target_id') || (state as any)?.id || 0);
  const { userProfile } = useProfile();
  const { ws, setWS } = useWS();
  const [target, setTarget] = useState<MobileUser | null>(null);
  const [records, setRecords] = useState<MsgResponse[]>([]);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);

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
    setSending(true);
    const payload = {
      target_user_id: targetId,
      content: text.trim(),
      type_name: 'str' as const,
      time: moment(Date.now()).format('YYYY-MM-DD HH:mm:ss'),
    };
    if (!ws?.ws || ws.ws.readyState !== WebSocket.OPEN) {
      message.warning('连接尚未建立');
      setSending(false);
      return;
    }
    try {
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
    } catch {
      message.error('发送失败，请稍后重试');
    } finally {
      setSending(false);
    }
  };

  if (!targetId) {
    return (
      <MobileShell title="私信" back tabs={false}>
        <EmptyState title="请选择聊天对象" />
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
            <EmptyState title="还没有消息" text="发出第一条私信后，会显示在这里。" />
          )}
        </Messages>
        <Composer>
          <Input
            value={text}
            onChange={(event) => setText(event.target.value)}
            onPressEnter={send}
            placeholder="写点什么..."
          />
          <PrimaryButton disabled={sending || !text.trim()} onClick={send}>
            发送
          </PrimaryButton>
        </Composer>
      </Wrap>
    </MobileShell>
  );
};

export default Chat;
