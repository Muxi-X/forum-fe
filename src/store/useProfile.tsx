import create from 'zustand';

interface Profile {
  userProfile: defs.UserProfile;
  qiniuToken: string;
  setUser: (profile: defs.UserProfile) => void;
  setToken: (token: string) => void;
}

const useProfile = create<Profile>((set) => ({
  userProfile: {},
  qiniuToken: '',
  setUser: (newProfile) => {
    set(() => ({ userProfile: newProfile }));
  },
  setToken: (token: string) =>
    set(() => ({
      qiniuToken: token,
    })),
}));

export default useProfile;
