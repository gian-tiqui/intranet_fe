import { create } from "zustand";

interface State {
  isRead: boolean;
  setIsRead: (isRead: boolean) => void;
}

const useReadStore = create<State>((set) => ({
  isRead: false,
  setIsRead: (isRead: boolean) => set({ isRead }),
}));

export default useReadStore;
