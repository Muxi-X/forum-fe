import create from 'zustand';

interface ChatAPI {
  user_id: string;
  type_id: string;
  content: string;
  time: string;
}

interface UserProfile {
  avatar: string;
  email: string;
  id: 0;
  name: string;
  role: 0;
}

interface MessageDtl {
  user: UserProfile;
  type_id: string;
  content: string;
  time: string;
}

type MessageList = MessageDtl[];

interface MsgListStore {
  msglist: MessageList;
  setMsgList: (newList: MessageList) => void;
}

const useMsgList = create<MsgListStore>((set, get) => ({
  msglist: [],
  setMsgList: (newList: MessageList) => {
    set(() => ({ msglist: newList }));
  },
}));

export default useMsgList;
