import { create } from "zustand";

interface State {
  postId: number | undefined;
  setPostId: (postId: number) => void;
}

const usePostIdStore = create<State>((set) => ({
  postId: undefined,
  setPostId: (postId: number) => set({ postId }),
}));

export default usePostIdStore;
