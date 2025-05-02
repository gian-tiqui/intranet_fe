import { create } from "zustand";

interface State {
  showSearch: boolean;
  setShowSearch: (showSearch: boolean) => void;
}

const useShowSearchStore = create<State>((set) => ({
  showSearch: false,
  setShowSearch: (showSearch: boolean) => set({ showSearch }),
}));

export default useShowSearchStore;
