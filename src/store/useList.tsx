import create from 'zustand';

interface List {
  postList: defs.post_Post[];
  setList: (list: defs.post_Post[]) => void;
  getList: () => defs.post_Post[];
}

const useList = create<List>((set, get) => ({
  postList: [],
  setList: (newList) => set(() => ({ postList: newList })),
  getList: () => {
    return get().postList;
  },
}));

export default useList;
