import useChat from 'store/useChat';

export interface Message {
  target_user_id: number;
  content: string;
  time: string;
  type_name: 'str' | 'file';
}

export interface MsgResponse {
  content: string;
  sender: number;
  time: string;
  type_name: 'str' | 'file';
}

const { parse, stringify } = JSON;

class WS {
  ws: WebSocket | null = null;
  url = `wss://forum.muxistudio.xyz/api/v1/chat/ws`;
  token: string;
  reconnectAttempts = 0; //当前ws重连次数
  maxReconnectAttempts = 3; //最大ws重连次数
  reconnectTimeout: any = null; //重连延时器
  // url = `ws://localhost:8080/api/v1/chat/ws`;
  constructor(token: string) {
    this.token = token;
    this.connect();
  }

  connect() {
    if (this.ws) {
      this.ws.close();
    }
    this.ws = new WebSocket(this.url, this.token);

    this.ws.onopen = () => {
      console.log('WebSocket 连接成功');
      this.clear();
    };

    this.ws.onerror = (err) => {
      console.error('WebSocket 连接错误', err);
    };

    this.ws.onclose = () => {
      console.warn('WebSocket 已关闭');
      this.reconnect();
    };
  }

  send(message: Message) {
    this.ws?.send(stringify(message));
  }

  reconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log('ws重连失败');
      return;
    }

    this.reconnectAttempts++;
    this.reconnectTimeout = setTimeout(() => {
      this.connect();
    }, 10000);
  }

  clear() {
    clearTimeout(this.reconnectTimeout);
    this.reconnectTimeout = null;
    this.reconnectAttempts = 0;
  }

  close() {
    if (this.ws) {
      this.clear();
      this.ws.close();
    }
  }
}

export default WS;
