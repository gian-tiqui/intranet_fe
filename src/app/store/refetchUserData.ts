import { create } from "zustand";

interface State {
  refetch: () => void;
  setRefetch: (func: () => void) => void;
}

const useRefetchUserStore = create<State>((set) => ({
  refetch: () => {},
  setRefetch: (refetch: () => void) => set({ refetch }),
}));

export default useRefetchUserStore;
