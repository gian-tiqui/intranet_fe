import { create } from "zustand";

interface State {
  showEditModal: boolean;
  setShowEditModal: (showEditModal: boolean) => void;
}

const useEditModalStore = create<State>((set) => ({
  showEditModal: false,
  setShowEditModal: (showEditModal: boolean) => set({ showEditModal }),
}));

export default useEditModalStore;
