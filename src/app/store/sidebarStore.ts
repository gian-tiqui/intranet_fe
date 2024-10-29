import { create } from "zustand";

interface State {
  sidebarShown: boolean;
  setSidebarShown: (sidebarShown: boolean) => void;
}

const useSidebarStore = create<State>((set) => ({
  sidebarShown: false,
  setSidebarShown: (sidebarShown: boolean) => set({ sidebarShown }),
}));

export default useSidebarStore;
