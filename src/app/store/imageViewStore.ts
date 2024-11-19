import { create } from "zustand";

interface State {
  showImage: { show: boolean; selectedIndex: number };
  setShowImage: (showImage: { show: boolean; selectedIndex: number }) => void;
}

const useShowImageStore = create<State>((set) => ({
  showImage: { show: false, selectedIndex: -1 },
  setShowImage: (showImage: { show: boolean; selectedIndex: number }) =>
    set({ showImage }),
}));

export default useShowImageStore;
