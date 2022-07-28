import create from 'zustand';

interface List {
  list: Array<any>;
  setList: (list: any) => void;
}

const useList = create<List>((set, get) => ({
  list: [],
  setList: (newlist: Array<any>) => {
    set(() => ({ list: newlist }));
  },
}));

export default useList;
