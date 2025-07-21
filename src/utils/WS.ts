import useChat from 'store/useChat';

export interface Message {
  target_user_id: number;
  content: string;
  time?: string;
  type_name: 'str' | 'file';
}

export interface MsgResponse {
  content: string;
  sender: number;
  time: string;
  type_name: 'str' | 'file';
}

const { parse, stringify } = JSON;
const id = localStorage.getItem('userId') || '';

class WS {
  ws: WebSocket;
  url = `wss://forum.muxistudio.xyz/api/v1/chat/ws${id ? `?id=${id}` : ''}`; //在url中添加query参数
  // url = `ws://localhost:8080/api/v1/chat/ws`;
  constructor(token: string) {
    this.ws = new WebSocket(this.url, token);

    this.ws.onopen = () => {
      console.log('WebSocket 连接成功');
    };

    this.ws.onerror = (err) => {
      console.error('WebSocket 连接错误', err);
    };

    this.ws.onclose = () => {
      console.warn('WebSocket 已关闭'); //在控制台新增websocket连接检测
    };
  }

  send(message: Message) {
    this.ws.send(stringify(message));
  }

  close() {
    this.ws.close();
  }
}

export default WS;
