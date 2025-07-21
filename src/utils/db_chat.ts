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
      contact: 'id, avatar, name, msgRecords, userId',
    });
  }
}

const db = new ContactsDatabase();

const Contacts = {
  // 增加新联系人
  addContact: async (contact: ContactWithUserId) => {
    return await db.contact.put({ ...contact });
  },

  // 删除联系人
  deleteContact: async (id: number) => {
    return await db.contact.delete(id);
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
  putRecords: async (records: MessageList, id: number) => {
    try {
      const contact = await db.contact.get(id);
      if (!contact) {
        console.error(`未找到 ID 为 ${id} 的联系人`);
        return false;
      }

      await db.contact.update(id, {
        msgRecords: records,
      });

      const updatedContact = await db.contact.get(id);
      // console.log('我明明更新了:', updatedContact);
      return true;
    } catch (error) {
      console.error('更新失败:', error);
      return false;
    }
  },
};

export default Contacts;
