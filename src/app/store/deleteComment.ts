import { create } from "zustand";

interface State {
  showDeleteComment: boolean;
  setShowDeleteComment: (showDeleteComment: boolean) => void;
}

const showDeleteCommentModalStore = create<State>((set) => ({
  showDeleteComment: false,
  setShowDeleteComment: (showDeleteComment: boolean) =>
    set({ showDeleteComment }),
}));

export default showDeleteCommentModalStore;
