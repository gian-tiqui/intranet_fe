import { create } from "zustand";

interface State {
  selectedId: number | undefined;
  setSelectedId: (selectedId: number | undefined) => void;
}

const userIdStore = create<State>((set) => ({
  selectedId: undefined,
  setSelectedId: (selectedId: number | undefined) => set({ selectedId }),
}));

export default userIdStore;
