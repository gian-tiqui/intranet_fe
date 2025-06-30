import { create } from "zustand";

interface SearchStore {
  searchTerm: string;
  deptId?: number;
  postTypeId?: number;
  folderDeptId?: number;
  searchTypes?: string[]; // <-- Add this
  setSearchParams: (params: {
    searchTerm: string;
    deptId?: number;
    postTypeId?: number;
    folderDeptId?: number;
    searchTypes?: string[]; // <-- Add this
  }) => void;
  clearSearchParams: () => void;
}

const searchTermStore = create<SearchStore>((set) => ({
  searchTerm: "",
  deptId: undefined,
  postTypeId: undefined,
  folderDeptId: undefined,
  searchTypes: ["post", "folder", "user"], // <-- Default types
  setSearchParams: ({
    searchTerm,
    deptId,
    postTypeId,
    folderDeptId,
    searchTypes,
  }) => set({ searchTerm, deptId, postTypeId, folderDeptId, searchTypes }),
  clearSearchParams: () =>
    set({
      searchTerm: "",
      deptId: undefined,
      postTypeId: undefined,
      folderDeptId: undefined,
      searchTypes: ["post", "folder", "user"], // <-- Reset to default
    }),
}));

export default searchTermStore;
