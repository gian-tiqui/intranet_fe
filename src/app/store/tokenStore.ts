import { create } from "zustand";

interface State {
  token: string;
  setToken: (token: string) => void;
}

const useTokenStore = create<State>((set) => ({
  token: "",
  setToken: (token: string) => set({ token }),
}));

export default useTokenStore;
