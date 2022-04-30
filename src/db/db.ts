import Dexie, { Table } from 'dexie';
import { EditorType } from 'pages/Editor/Editor';

export interface Draft {
  id: string;
  title: string;
  content: string;
  type: EditorType;
}

class DraftDatabase extends Dexie {
  draft!: Table<Draft>;

  constructor() {
    super('draftDatabase');
    this.version(1).stores({
      draft: 'id, title, content, type',
    });
  }
}

const db = new DraftDatabase();

export const putDraft = (id: string, draft: Partial<Draft>) => {
  console.log(id);
  db.draft.put({
    ...(draft as Draft),
    id,
  });
};

// 获得单个草稿
export const searchDraft = async (id: string) => {
  const data = await db.draft.get(id);
  return data;
};

// 获得草稿箱列表
export const getDraftsList = async () => {
  const lists = await db.draft.toArray();
  return lists;
};

export default db;
