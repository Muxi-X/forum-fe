import Dexie, { Table } from 'dexie';
import { Contact, MessageList } from 'store/useChat';

interface ContactWithUserId extends Contact {
  userId: number;
  lastModified: number;
}

class ContactsDatabase extends Dexie {
  contact!: Table<ContactWithUserId>;

  constructor() {
    super('contactsDatabase');
    this.version(5).stores({
      contact: '[id+userId], avatar, name, userId, lastModified', //这里为了对当前用户做区分将主键又id改为复合键[id+userId]
    });
  }
}

const db = new ContactsDatabase();

const Contacts = {
  // 增加新联系人
  addContact: async (contact: ContactWithUserId) => {
    return await db.contact.put({
      ...contact,
      lastModified: Date.now(),
    });
  },

  // 删除联系人
  deleteContact: async (id: number, userId: number) => {
    return await db.contact.delete([id, userId]);
  },

  // 获得联系人列表
  getContacts: async (userId: number) => {
    const list = await db.contact.where('userId').equals(userId).sortBy('lastModified');
    return list.reverse();
  },

  searchContact: async (id: number, userId: number) => {
    const contact = await db.contact.where({ id, userId }).first();
    return contact;
  },

  // 更新聊天记录
  putRecords: async (records: MessageList, id: number, userId: number) => {
    try {
      await db.contact.update([id, userId], {
        msgRecords: records,
        lastModified: Date.now(),
      });
    } catch (error) {
      console.error('更新失败:', error);
    }
  },
};

export default Contacts;
