import { create } from "zustand";

interface State {
  hidden: boolean;
  setHidden: (hidden: boolean) => void;
}

const useNavbarVisibilityStore = create<State>((set) => ({
  hidden: false,
  setHidden: (hidden: boolean) => set({ hidden }),
}));

export default useNavbarVisibilityStore;
