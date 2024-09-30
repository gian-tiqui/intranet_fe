import { create } from "zustand";

interface State {
  shown: boolean;
  setShown: (shown: boolean) => void;
}

const useShowSettingsStore = create<State>((set) => ({
  shown: false,
  setShown: (shown: boolean) => set({ shown }),
}));

export default useShowSettingsStore;
