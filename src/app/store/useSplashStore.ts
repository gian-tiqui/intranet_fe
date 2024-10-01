import { create } from "zustand";

interface State {
  showSplash: boolean;
  setShowSplash: (showSplash: boolean) => void;
}

const useSplashToggler = create<State>((set) => ({
  showSplash: false,
  setShowSplash: (showSplash: boolean) => set({ showSplash }),
}));

export default useSplashToggler;
