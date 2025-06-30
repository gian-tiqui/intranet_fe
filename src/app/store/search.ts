// searchTermStore.ts
import { create } from "zustand";

interface SearchStore {
  searchTerm: string;
  deptId?: number;
  postTypeId?: number;
  folderDeptId?: number;
  setSearchParams: (params: {
    searchTerm: string;
    deptId?: number;
    postTypeId?: number;
    folderDeptId?: number;
  }) => void;
  clearSearchParams: () => void;
}

const searchTermStore = create<SearchStore>((set) => ({
  searchTerm: "",
  deptId: undefined,
  postTypeId: undefined,
  folderDeptId: undefined,
  setSearchParams: ({ searchTerm, deptId, postTypeId, folderDeptId }) =>
    set({ searchTerm, deptId, postTypeId, folderDeptId }),
  clearSearchParams: () =>
    set({
      searchTerm: "",
      deptId: undefined,
      postTypeId: undefined,
      folderDeptId: undefined,
    }),
}));

export default searchTermStore;
