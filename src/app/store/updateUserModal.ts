import { create } from "zustand";

interface State {
  updateModalShown: boolean;
  setUpdateModalShown: (updateModalShown: boolean) => void;
}

const updateModalStore = create<State>((set) => ({
  updateModalShown: false,
  setUpdateModalShown: (updateModalShown: boolean) => set({ updateModalShown }),
}));

export default updateModalStore;
