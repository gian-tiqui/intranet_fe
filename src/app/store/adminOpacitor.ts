import { create } from "zustand";

interface State {
  aShown: boolean;
  setAShown: (aShown: boolean) => void;
}

const useAdminHiderStore = create<State>((set) => ({
  aShown: false,
  setAShown: (aShown: boolean) => set({ aShown }),
}));

export default useAdminHiderStore;
