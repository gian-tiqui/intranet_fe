import { create } from "zustand";

interface State {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

const useToggleStore = create<State>((set) => ({
  isCollapsed: false,
  setIsCollapsed: (isCollapsed: boolean) => set({ isCollapsed }),
}));

export default useToggleStore;
