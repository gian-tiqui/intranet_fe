import { create } from "zustand";

interface State {
  viewUser: boolean;
  setViewUser: (viewUser: boolean) => void;
}

const viewUserStore = create<State>((set) => ({
  viewUser: false,
  setViewUser: (viewUser: boolean) => set({ viewUser }),
}));

export default viewUserStore;
