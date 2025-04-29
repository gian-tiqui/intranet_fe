import { create } from "zustand";

interface State {
  showActivityBar: boolean;
  setShowActivityBar: (showActivityBarStore: boolean) => void;
}

const useActivityBarStore = create<State>((set) => ({
  showActivityBar: false,
  setShowActivityBar: (showActivityBar) => set({ showActivityBar }),
}));

export default useActivityBarStore;
