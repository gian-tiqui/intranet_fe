import { create } from "zustand";

interface State {
  uriPost: string;
  setPostUri: (uriPost: string) => void;
}

const usePostUriStore = create<State>((set) => ({
  uriPost: "",
  setPostUri: (uriPost: string) => set({ uriPost }),
}));

export default usePostUriStore;
