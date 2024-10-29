import { create } from "zustand";

interface State {
  deptId: number | undefined;
  setDeptId: (deptId: number) => void;
}

const useDeptIdStore = create<State>((set) => ({
  deptId: undefined,
  setDeptId: (deptId: number) => set({ deptId }),
}));

export default useDeptIdStore;
