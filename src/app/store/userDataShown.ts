import { create } from "zustand";

interface State {
  userDataShown: boolean;
  setUserDataShown: (userDataShown: boolean) => void;
}

const userDataShownStore = create<State>((set) => ({
  userDataShown: false,
  setUserDataShown: (userDataShown: boolean) => set({ userDataShown }),
}));

export default userDataShownStore;
