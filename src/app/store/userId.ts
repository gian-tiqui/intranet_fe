import { create } from "zustand";

interface State {
  selectedId: number | undefined;
  setSelectedId: (selectedId: number) => void;
}

const userIdStore = create<State>((set) => ({
  selectedId: undefined,
  setSelectedId: (selectedId: number) => set({ selectedId }),
}));

export default userIdStore;
