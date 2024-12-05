import { create } from "zustand";
import { Folder } from "../types/types";

interface State {
  selectedFolder: Folder | undefined;
  setSelectedFolder: (selectedFolder: Folder | undefined) => void;
}

const useFolderStore = create<State>((set) => ({
  selectedFolder: undefined,
  setSelectedFolder: (selectedFolder: Folder | undefined) =>
    set({ selectedFolder }),
}));

export default useFolderStore;
