import { create } from "zustand";
import { PostComment } from "../types/types";

interface State {
  replies: PostComment[];
  setReplies: (replies: PostComment[]) => void;
}

const useRepliesStore = create<State>((set) => ({
  replies: [],
  setReplies: (replies: PostComment[]) => set({ replies }),
}));

export default useRepliesStore;
