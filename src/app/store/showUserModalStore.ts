import { create } from "zustand";

interface State {
  isShown: boolean;
  setIsShown: (isShown: boolean) => void;
}

const useUserModalStore = create<State>((set) => ({
  isShown: false,
  setIsShown: (isShown: boolean) => set({ isShown }),
}));

export default useUserModalStore;
