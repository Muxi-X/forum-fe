import create from 'zustand';

interface List {
  postList: defs.post_Post[];
  setList: (list: defs.post_Post[]) => void;
}

const useList = create<List>((set, get) => ({
  postList: [],
  setList: (newList) => set(() => ({ postList: newList })),
}));

export default useList;
