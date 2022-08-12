import create from 'zustand';

interface List {
  postList: defs.post_ListResponse[];
  setList: (list: defs.post_ListResponse[]) => void;
}

const useList = create<List>((set, get) => ({
  postList: [],
  setList: (newList) => set(() => ({ postList: newList })),
}));

export default useList;
