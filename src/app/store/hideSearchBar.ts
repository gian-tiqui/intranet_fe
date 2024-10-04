import { create } from "zustand";

interface State {
  searchBarHidden: boolean;
  setSearchBarHidden: (searchBarHidden: boolean) => void;
}

const useHideSearchBarStore = create<State>((set) => ({
  searchBarHidden: false,
  setSearchBarHidden: (searchBarHidden: boolean) => set({ searchBarHidden }),
}));

export default useHideSearchBarStore;
