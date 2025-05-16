import { create } from "zustand";

interface State {
  editFolderId: number | undefined;
  setEditFolderId: (editFolderId: number) => void;
}

const useEditFolderIdStore = create<State>((set) => ({
  editFolderId: undefined,
  setEditFolderId: (editFolderId: number | undefined) => set({ editFolderId }),
}));

export default useEditFolderIdStore;
