import create from 'zustand';

interface Profile {
  userProfile: defs.UserProfile;
  setUser: (profile: defs.UserProfile) => void;
}

const useProfile = create<Profile>((set) => ({
  userProfile: {},
  setUser: (newProfile) => set(() => ({ userProfile: newProfile })),
}));

export default useProfile;
