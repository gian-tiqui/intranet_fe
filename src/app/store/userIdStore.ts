import { create } from "zustand";

interface State {
  userId: number | undefined;
  setUserId: (userId: number) => void;
}

const useUserIdStore = create<State>((set) => ({
  userId: undefined,
  setUserId: (userId: number) => set({ userId }),
}));

export default useUserIdStore;
