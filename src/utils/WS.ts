import useChat from 'store/useChat';

export interface Message {
  target_user_id: number;
  content: string;
  time: string;
  type_name: 'str' | 'file';
}

export interface MsgResponse {
  content: string;
  sender_id: number;
  receiver_id: number;
  sender?: number;
  time: string;
  type_name: 'str' | 'file';
}

const { parse, stringify } = JSON;
type MessageHandler = (message: MsgResponse) => void;

const resolveWSURL = () => {
  const envURL = import.meta.env.VITE_WS_URL?.trim();
  if (envURL) {
    return envURL;
  }
  if (import.meta.env.DEV) {
    return 'ws://localhost:8080/api/v1/chat/ws';
  }
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  return `${protocol}//${window.location.host}/api/v1/chat/ws`;
};

class WS {
  ws: WebSocket | null = null;
  url = resolveWSURL();
  token: string;
  listeners = new Set<MessageHandler>();
  reconnectAttempts = 0; //当前ws重连次数
  maxReconnectAttempts = 10; //最大ws重连次数
  reconnectTimeout: any = null; //重连延时器
  manuallyClosed = false;
  constructor(token: string) {
    this.token = token;
    this.connect();
  }

  connect() {
    if (this.ws) {
      this.ws.onclose = null;
      this.ws.close();
    }
    this.manuallyClosed = false;
    this.ws = new WebSocket(this.url, this.token);

    this.ws.onopen = () => {
      console.log('WebSocket 连接成功');
      this.clear();
    };

    this.ws.onmessage = (event) => {
      try {
        const data = parse(event.data) as MsgResponse;
        if (!data.sender_id && data.sender) {
          data.sender_id = data.sender;
        }
        this.listeners.forEach((listener) => listener(data));
      } catch (error) {
        console.error('WebSocket 消息解析失败', error);
      }
    };

    this.ws.onerror = (err) => {
      console.error('WebSocket 连接错误', err);
    };

    this.ws.onclose = () => {
      console.warn('WebSocket 已关闭');
      if (this.manuallyClosed) return;
      this.reconnect();
    };
  }

  send(message: Message) {
    this.ws?.send(stringify(message));
  }

  subscribe(listener: MessageHandler) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  reconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log('ws重连失败');
      return;
    }

    this.reconnectAttempts++;
    this.reconnectTimeout = setTimeout(() => {
      this.connect();
    }, 3000);
  }

  clear() {
    clearTimeout(this.reconnectTimeout);
    this.reconnectTimeout = null;
    this.reconnectAttempts = 0;
  }

  close() {
    if (this.ws) {
      this.manuallyClosed = true;
      this.clear();
      this.ws.close();
    }
  }
}

export default WS;
