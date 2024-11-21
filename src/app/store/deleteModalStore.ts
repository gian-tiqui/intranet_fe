import { create } from "zustand";

interface State {
  showDeleteModal: boolean;
  setShowDeleteModal: (showDeleteModal: boolean) => void;
}

const useDeleteModalStore = create<State>((set) => ({
  showDeleteModal: false,
  setShowDeleteModal: (showDeleteModal: boolean) => set({ showDeleteModal }),
}));

export default useDeleteModalStore;
