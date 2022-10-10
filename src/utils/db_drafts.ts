import Dexie, { Table } from 'dexie';

export type EditorType = 'rtf' | 'md';

export interface Draft {
  id: string;
  title: string;
  content: string;
  type: EditorType;
  userId: number | undefined;
  time: string;
}

class DraftDatabase extends Dexie {
  draft!: Table<Draft>;

  constructor() {
    super('draftDatabase');
    this.version(1).stores({
      draft: 'id, userId, title, content, type, time',
    });
  }
}

const db = new DraftDatabase();

const Drafts = {
  // 根据UserID获得草稿列表(本地)
  getDraftsList: async (userId: number) => {
    const list = await db.draft.where('userId').equals(userId).toArray();
    return list;
  },

  // 更新草稿
  putDraft: (id: string, draft: Partial<Draft>) => {
    db.draft.put({
      ...(draft as Draft),
      id,
    });
  },

  // 获得单个草稿
  searchDraft: async (id: string) => {
    const data = await db.draft.get(id);
    return data;
  },

  // 删除草稿
  deleteDraft: (id: string) => {
    db.draft.delete(id);
  },
};

export default Drafts;
