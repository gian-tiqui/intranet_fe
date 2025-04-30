import { create } from "zustand";
import Cookies from "js-cookie";
import { INTRANET } from "../bindings/binding";

interface State {
  isLoggedIn: boolean;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
}

const useLoginStore = create<State>((set) => ({
  isLoggedIn: Cookies.get(INTRANET) !== undefined,
  setIsLoggedIn: (isLoggedIn: boolean) => set({ isLoggedIn }),
}));

export default useLoginStore;
