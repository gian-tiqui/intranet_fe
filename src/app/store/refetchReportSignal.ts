import { create } from "zustand";

interface State {
  signal: boolean;
  setSignal: (signal: boolean) => void;
}

const useReportSignalStore = create<State>((set) => ({
  signal: false,
  setSignal: (signal: boolean) => set({ signal }),
}));

export default useReportSignalStore;
