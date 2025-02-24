import { create } from "zustand";

interface State {
  updatedDialogShown: boolean;
  setUpdateDialogShown: (updateDialogShown: boolean) => void;
}

const useUpdateDialogStore = create<State>((set) => ({
  updatedDialogShown: true,
  setUpdateDialogShown: (updatedDialogShown: boolean) =>
    set({ updatedDialogShown }),
}));

export default useUpdateDialogStore;
