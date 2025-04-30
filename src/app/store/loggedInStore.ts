import { create } from "zustand";
import { INTRANET } from "../bindings/binding";
import Cookies from "js-cookie";

interface State {
  isLoggedIn: boolean;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
}

const useLoginStore = create<State>((set) => ({
  isLoggedIn:
    localStorage.getItem(INTRANET) !== undefined &&
    Cookies.get(INTRANET) !== undefined,
  setIsLoggedIn: (isLoggedIn: boolean) => set({ isLoggedIn }),
}));

export default useLoginStore;
