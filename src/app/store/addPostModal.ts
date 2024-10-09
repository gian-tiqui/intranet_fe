import { create } from "zustand";

interface State {
  addModalShown: boolean;
  setAddModalShown: (addModalShown: boolean) => void;
}

const addModalStore = create<State>((set) => ({
  addModalShown: false,
  setAddModalShown: (addModalShown: boolean) => set({ addModalShown }),
}));

export default addModalStore;
