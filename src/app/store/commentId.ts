import { create } from "zustand";

interface State {
  commentId: number;
  setCommentId: (commentId: number) => void;
}

const commentIdStore = create<State>((set) => ({
  commentId: 0,
  setCommentId: (commentId: number) => set({ commentId }),
}));

export default commentIdStore;
