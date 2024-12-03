import { create } from "zustand";
import { QmType } from "../types/types";

interface State {
  selectedFolder: QmType | undefined;
  setSelectedFolder: (selectedFolder: QmType) => void;
}

const useFolderStore = create<State>((set) => ({
  selectedFolder: undefined,
  setSelectedFolder: (selectedFolder: QmType) => set({ selectedFolder }),
}));

export default useFolderStore;
