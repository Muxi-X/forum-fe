import create from 'zustand';
import WS from 'utils/WS';

interface WSStore {
  ws: WS | null;
  tip: boolean;
  setWS: (ws: WS) => void;
  setTip: (tip: boolean) => void;
}

const useWS = create<WSStore>((set, get) => ({
  ws: null,
  tip: false,
  setWS: (ws) => {
    set(() => ({ ws }));
  },
  setTip: (isTip: boolean) => {
    set(() => ({ tip: isTip }));
  },
}));

export default useWS;
