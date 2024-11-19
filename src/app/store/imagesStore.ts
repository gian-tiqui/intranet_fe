import { create } from "zustand";

interface State {
  images: string[];
  setImages: (images: string[]) => void;
}

const useImagesStore = create<State>((set) => ({
  images: [],
  setImages: (images: string[]) => set({ images }),
}));

export default useImagesStore;
