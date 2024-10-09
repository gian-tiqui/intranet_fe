import { create } from "zustand";

interface State {
  showDeleteModal: boolean;
  setShowDeleteModal: (showDeleteModal: boolean) => void;
}

const deleteUserStore = create<State>((set) => ({
  showDeleteModal: false,
  setShowDeleteModal: (showDeleteModal: boolean) => set({ showDeleteModal }),
}));

export default deleteUserStore;
