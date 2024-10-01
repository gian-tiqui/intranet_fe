import { create } from "zustand";

interface State {
  showReplies: boolean;
  setShowReplies: (showReplies: boolean) => void;
}

const useShowReplies = create<State>((set) => ({
  showReplies: false,
  setShowReplies: (showReplies: boolean) => set({ showReplies }),
}));

export default useShowReplies;
