import { create } from "zustand";

interface State {
  showLogoutArt: boolean;
  setShowLogoutArt: (showLogoutArt: boolean) => void;
}

const useLogoutArtStore = create<State>((set) => ({
  showLogoutArt: false,
  setShowLogoutArt: (showLogoutArt) => set({ showLogoutArt }),
}));

export default useLogoutArtStore;
