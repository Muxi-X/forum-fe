import create from 'zustand';
import WS, { MsgResponse, Message } from 'utils/WS';

export type MessageList = (MsgResponse | Message)[];

export interface Contact extends defs.user {
  msgRecords: MessageList;
  userId: number;
}

interface MsgListStore {
  contacts: Contact[];
  selectedId: number;
  setSelectedId: (id: number) => void;
  setContacts: (newList: Contact[]) => void;
  setRecords: (records: MessageList, id: number, userId: number) => void;
  getRecords: (id: number, userId: number) => MessageList;
  getContact: (id: number, userId: number) => Contact;
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
  getRecords: (id: number, userId: number) => {
    if (get().contacts.filter((contact) => contact.userId === userId).length > 0) {
      return get().contacts.filter(
        (contact) => contact.id === id && contact.userId === userId,
      )[0].msgRecords;
    } else return [];
  },
  getContact: (id: number, userId: number) => {
    if (get().contacts.filter((contact) => contact.userId === userId).length > 0)
      return get().contacts.filter(
        (contact) => contact.id === id && contact.userId === userId,
      )[0];
    else return { msgRecords: [], userId: userId };
  },
  setRecords: (records: MessageList, id: number, userId: number) => {
    const updatedContacts = get().contacts.map((contact) =>
      contact.userId === userId && contact.id === id
        ? { ...contact, msgRecords: records }
        : contact,
    );
    set({ contacts: updatedContacts });
  },
}));

export default useChat;
