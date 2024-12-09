import { create } from "zustand";

interface State {
  showDeleteFolderModal: boolean;
  setShowDeleteFolderModal: (showDeleteModal: boolean) => void;
}

const deleteFolderStore = create<State>((set) => ({
  showDeleteFolderModal: false,
  setShowDeleteFolderModal: (showDeleteFolderModal: boolean) =>
    set({ showDeleteFolderModal }),
}));

export default deleteFolderStore;
