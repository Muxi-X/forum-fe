import create from 'zustand';
import WS, { MsgResponse, Message } from 'utils/WS';

export type MessageList = (MsgResponse | Message)[];

export interface Contact extends defs.user {
  msgRecords: MessageList;
}

interface MsgListStore {
  contacts: Contact[];
  selectedId: number;
  setSelectedId: (id: number) => void;
  setContacts: (newList: Contact[]) => void;
  setRecords: (records: MessageList, id: number) => void;
  getRecords: (id: number) => MessageList;
  getContact: (id: number) => Contact;
}

const useChat = create<MsgListStore>((set, get) => ({
  contacts: [],

  setContacts: (contacts: Contact[]) => {
    set(() => ({ contacts }));
  },
  selectedId: 0,
  setSelectedId: (id: number) => {
    set(() => ({ selectedId: id }));
  },
  getRecords: (id: number) => {
    if (get().contacts.length > 0) {
      return get().contacts.filter((contact) => contact.id === id)[0].msgRecords;
    } else return [];
  },
  getContact: (id: number) => {
    if (get().contacts.length > 0)
      return get().contacts.filter((contact) => contact.id === id)[0];
    else return { msgRecords: [] };
  },
  setRecords: (records: MessageList, id: number) => {
    const contacts = get().contacts;
    for (const contact of contacts) {
      if (contact.id === id) contact.msgRecords = records;
    }
    set({ contacts });
  },
}));

export default useChat;
