import { create } from "zustand";
import { User } from "../types/types";

interface State {
  user: User | null;
  setUser: (user: User | null) => void;
}

const useUserStore = create<State>((set) => ({
  user: null,
  setUser: (user: User | null) => set({ user }),
}));

export default useUserStore;
