import Dexie, { Table } from 'dexie';
import { Contact, MessageList } from 'store/useChat';

interface ContactWithUserId extends Contact {
  userId: number | undefined;
  lastModified: number;
}

class ContactsDatabase extends Dexie {
  contact!: Table<ContactWithUserId>;

  constructor() {
    super('contactsDatabase');
    this.version(4).stores({
      contact: 'id, avatar, name, userId, lastModified',
    });
  }
}

const db = new ContactsDatabase();

const Contacts = {
  // 增加新联系人
  addContact: async (contact: ContactWithUserId) => {
    return await db.contact.put({ ...contact, lastModified: Date.now() });
  },

  // 删除联系人
  deleteContact: async (id: number) => {
    return await db.contact.delete(id);
  },

  // 获得联系人列表
  getContacts: async (userId: number) => {
    const list = await db.contact.where('userId').equals(userId).sortBy('lastModified');
    return list.reverse();
  },

  // 获得单个联系人
  searchContact: async (id: number) => {
    const contact = await db.contact.get(id);
    return contact;
  },

  // 更新聊天记录
  putRecords: async (records: MessageList, id: number) => {
    try {
      await db.contact.update(id, {
        msgRecords: records,
        lastModified: Date.now(),
      });
    } catch (error) {
      console.error('更新失败:', error);
    }
  },
};

export default Contacts;
