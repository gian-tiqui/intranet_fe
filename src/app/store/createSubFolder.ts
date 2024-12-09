import { create } from "zustand";

interface State {
  openSubFolder: boolean;
  setOpenSubFolder: (openSubFolder: boolean) => void;
}

const useSubFolderStore = create<State>((set) => ({
  openSubFolder: false,
  setOpenSubFolder: (openSubFolder: boolean) => set({ openSubFolder }),
}));

export default useSubFolderStore;
