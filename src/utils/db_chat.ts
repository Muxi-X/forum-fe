import Dexie, { Table } from 'dexie';
import { Contact, MessageList } from 'store/useChat';

interface ContactWithUserId extends Contact {
  userId: number | undefined;
}

class ContactsDatabase extends Dexie {
  contact!: Table<ContactWithUserId>;

  constructor() {
    super('contactsDatabase');
    this.version(1).stores({
      contact: 'id, avatar, name, msgRecord, userId',
    });
  }
}

const db = new ContactsDatabase();

const Contacts = {
  // 增加新联系人
  addContact: (contact: ContactWithUserId) => {
    db.contact.put({ ...contact });
  },

  // 删除联系人
  deleteContact: async (id: number) => {
    db.contact.delete(id);
  },

  // 获得联系人列表
  getContacts: async (userId: number) => {
    const list = await db.contact.where('userId').equals(userId).toArray();
    return list.reverse();
  },

  // 获得单个联系人
  searchContact: async (id: number) => {
    const contact = await db.contact.get(id);
    return contact;
  },

  // 更新聊天记录
  putRecords: (records: MessageList, id: number) => {
    db.contact.get(id).then((res) => {
      db.contact.put({ ...(res as ContactWithUserId), msgRecords: records });
    });
  },
};

export default Contacts;
