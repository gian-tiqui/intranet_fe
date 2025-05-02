import { create } from "zustand";

interface State {
  folderDialogVisible: boolean;
  setFolderDialogVisible: (folderDialogVisible: boolean) => void;
}

const useFolderDialogVisibleStore = create<State>((set) => ({
  folderDialogVisible: false,
  setFolderDialogVisible: (folderDialogVisible: boolean) =>
    set({ folderDialogVisible }),
}));

export default useFolderDialogVisibleStore;
