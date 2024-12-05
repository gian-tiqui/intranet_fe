import { create } from "zustand";
import { Folder } from "../types/types";

interface State {
  subfolder: Folder | undefined;
  setSubfolder: (subfolder: Folder | undefined) => void;
}

const useSubfolderStore = create<State>((set) => ({
  subfolder: undefined,
  setSubfolder: (subfolder: Folder | undefined) => set({ subfolder }),
}));

export default useSubfolderStore;
