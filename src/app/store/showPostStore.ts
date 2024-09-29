import { create } from "zustand";

interface State {
  visible: boolean;
  setVisible: (visible: boolean) => void;
}

const useShowPostStore = create<State>((set) => ({
  visible: false,
  setVisible: (visible: boolean) => set({ visible }),
}));

export default useShowPostStore;
