import { create } from "zustand";

interface State {
  deletePostModalShown: boolean;
  setDeletePostModalShown: (deletePostModalShown: boolean) => void;
}

const useDeletePostStore = create<State>((set) => ({
  deletePostModalShown: false,
  setDeletePostModalShown: (deletePostModalShown: boolean) =>
    set({
      deletePostModalShown,
    }),
}));

export default useDeletePostStore;
