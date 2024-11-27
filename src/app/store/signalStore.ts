import { create } from "zustand";

interface State {
  signal: boolean;
  setSignal: (signal: boolean) => void;
}

const useSignalStore = create<State>((set) => ({
  signal: false,
  setSignal: (signal: boolean) => set({ signal }),
}));

export default useSignalStore;
