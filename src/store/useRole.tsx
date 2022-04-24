import create from 'zustand';

type TestRole = { r: number; g: string };

interface Role {
  role: any;
  up: (level: any) => void;
}

const useRole = create<Role>((set) => ({
  role: { user: { name: 'foo', pwd: 'bar' }, g: '111' },
  up: (s) => set(() => s),
}));

export default useRole;
