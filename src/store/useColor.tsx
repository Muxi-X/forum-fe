import create from 'zustand';

interface Color {
  color: string;
  setColor: (color: string) => void;
}

const useColor = create<Color>((set, get) => ({
  color: 'white',
  setColor: (newcolor) => set(() => ({ color: newcolor })),
}));

export default useColor;
