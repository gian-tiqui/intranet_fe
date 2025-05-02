import { create } from "zustand";

interface State {
  userProfileVisible: boolean;
  setUserProfileVisible: (userProfileVisible: boolean) => void;
}

const useUserProfileStore = create<State>((set) => ({
  userProfileVisible: false,
  setUserProfileVisible: (userProfileVisible: boolean) =>
    set({ userProfileVisible }),
}));

export default useUserProfileStore;
