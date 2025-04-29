import { create } from "zustand";

interface State {
  uVisible: boolean;
  setUVisible: (uVisible: boolean) => void;
}

const useShowUserModalStore = create<State>((set) => ({
  uVisible: false,
  setUVisible: (uVisible: boolean) => set({ uVisible }),
}));

export default useShowUserModalStore;
