import create from 'zustand';

interface UserInformation {
  avatar: string;
  email: string;
  id: number;
  name: string;
  role: number;
}

interface Privacy {
  user: Partial<UserInformation>;
  setUser: any;
}

const usePrivacy = create<Privacy>((set) => ({
  user: {},
  setUser: () => {},
}));

export default usePrivacy;
