import useChat from 'store/useChat';

export interface Message {
  target_user_id: number;
  content: string;
  type_name: 'str' | 'file';
  time?: string;
}

export interface MsgResponse {
  content: string;
  sender: number;
  time: string;
  type_name: 'str' | 'file';
}

const { parse, stringify } = JSON;

class WS {
  ws: WebSocket;
  url = `wss://forum.muxistudio.xyz/api/v1/chat/ws`;
  // url = `ws://localhost:8080/api/v1/chat/ws`;
  constructor(token: string) {
    this.ws = new WebSocket(this.url, token);
  }

  send(message: Message) {
    this.ws.send(stringify(message));
  }

  close() {
    this.ws.close();
  }
}

export default WS;
