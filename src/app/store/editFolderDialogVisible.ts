import { create } from "zustand";

interface State {
  editFolderDialogVisible: boolean;
  setEditFolderDialogVisible: (editFolderDialogVisible: boolean) => void;
}

const useEditFolderDialogVisibleStore = create<State>((set) => ({
  editFolderDialogVisible: false,
  setEditFolderDialogVisible: (editFolderDialogVisible: boolean) =>
    set({ editFolderDialogVisible }),
}));

export default useEditFolderDialogVisibleStore;
