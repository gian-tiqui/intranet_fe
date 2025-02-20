import { create } from "zustand";

interface State {
  postId: number | undefined;
  setPostId: (postId: number | undefined) => void;
}

const usePostIdStore = create<State>((set) => ({
  postId: undefined,
  setPostId: (postId: number | undefined) => set({ postId }),
}));

export default usePostIdStore;
