import Dexie, { Table } from 'dexie';
import { Contact, MessageList } from 'store/useChat';

class ContactsDatabase extends Dexie {
  contact!: Table<Contact>;

  constructor() {
    super('contactsDatabase');
    this.version(1).stores({
      contact: 'id, avatar, name, msgRecord',
    });
  }
}

const db = new ContactsDatabase();

const Contacts = {
  // 增加新联系人
  addContact: (contact: Contact) => {
    db.contact.put({ ...contact });
  },

  // 删除联系人
  deleteContact: async (id: number) => {
    db.contact.delete(id);
  },

  // 获得联系人列表
  getContacts: async () => {
    const list = await db.contact.toArray();
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
      db.contact.put({ ...res, msgRecords: records });
    });
  },
};

export default Contacts;
