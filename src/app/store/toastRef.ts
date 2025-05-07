import { Toast } from "primereact/toast";
import { RefObject } from "react";
import { create } from "zustand";

interface State {
  toastRef: RefObject<Toast> | null;
  setToastRef: (ref: RefObject<Toast> | null) => void;
}

const useToastRefStore = create<State>((set) => ({
  toastRef: null,
  setToastRef: (ref: RefObject<Toast> | null) => set({ toastRef: ref }),
}));

export default useToastRefStore;
