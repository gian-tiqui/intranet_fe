import { create } from "zustand";

interface State {
  searchTerm: string;
  setSearchTerm: (searchTerm: string) => void;
}

const searchTermStore = create<State>((set) => ({
  searchTerm: "",
  setSearchTerm: (searchTerm: string) => set({ searchTerm }),
}));

export default searchTermStore;
