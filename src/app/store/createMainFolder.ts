import { create } from "zustand";

interface State {
  openCreateFolderModal: boolean;
  setOpenCreateFolderModal: (openCreateFolderModal: boolean) => void;
}

const useOpenCreateFolderMainStore = create<State>((set) => ({
  openCreateFolderModal: false,
  setOpenCreateFolderModal: (openCreateFolderModal: boolean) =>
    set({ openCreateFolderModal }),
}));

export default useOpenCreateFolderMainStore;
