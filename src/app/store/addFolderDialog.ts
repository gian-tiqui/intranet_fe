import { create } from "zustand";

interface State {
  addFolderDialogVisible: boolean;
  setAddFolderDialogVisible: (addFolderDialogVisible: boolean) => void;
}

const useAddFolderStore = create<State>((set) => ({
  addFolderDialogVisible: false,
  setAddFolderDialogVisible: (addFolderDialogVisible: boolean) =>
    set({ addFolderDialogVisible }),
}));

export default useAddFolderStore;
