import { create } from "zustand";

interface State {
  folderId: number | undefined;
  setFolderId: (folderId: number) => void;
}

const useFolderIdStore = create<State>((set) => ({
  folderId: undefined,
  setFolderId: (folderId: number) => set({ folderId }),
}));

export default useFolderIdStore;
