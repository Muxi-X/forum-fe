import create from 'zustand';

interface Special {
  showHeader: boolean;
  setShowHeader: (showHeader: boolean) => void;
}

const useShowHeader = create<Special>((set, get) => ({
  showHeader: false,
  setShowHeader: (showHeader) => set(() => ({ showHeader })),
}));

export default useShowHeader;
