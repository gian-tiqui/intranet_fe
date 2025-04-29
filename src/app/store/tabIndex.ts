import { create } from "zustand";

interface State {
  tabIndex: number;
  setTabIndex: (tabIndex: number) => void;
}

const tabIndexStore = create<State>((set) => ({
  tabIndex: 0,
  setTabIndex: (tabIndex: number) => set({ tabIndex }),
}));

export default tabIndexStore;
