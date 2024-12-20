import { create } from "zustand";

interface State {
  cid: number | undefined;
  setCid: (cid: number | undefined) => void;
}

const useCommentIdRedirector = create<State>((set) => ({
  cid: undefined,
  setCid: (cid: number | undefined) => set({ cid }),
}));

export default useCommentIdRedirector;
