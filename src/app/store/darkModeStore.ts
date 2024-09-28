import { create } from "zustand";

interface State {
  isDarkMode: boolean;
  setIsDarkMode: (value: boolean) => void;
}

const useDarkModeStore = create<State>((set) => ({
  isDarkMode: false,
  setIsDarkMode: (value: boolean) => set({ isDarkMode: value }),
}));

export default useDarkModeStore;
