import { create } from "zustand";

interface State {
  pid: number | undefined;
  setPid: (pid: number) => void;
}

const useSelectedPostIdStore = create<State>((set) => ({
  pid: undefined,
  setPid: (pid: number) => set({ pid }),
}));

export default useSelectedPostIdStore;
