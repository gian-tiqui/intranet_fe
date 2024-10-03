import { create } from "zustand";
import { jwtDecode } from "jwt-decode";
import useTokenStore from "./tokenStore";

interface State {
  showElem: boolean;
  setShowElem: (showElem: boolean) => void;
}

const CheckRole = () => {
  const allowedDepts = ["HR", "ADMIN", "QM"];
  const { token } = useTokenStore();

  if (!token) return false;

  const decoded: { departmentName: string } = jwtDecode(token);

  return allowedDepts.includes(decoded.departmentName);
};

const useHiderStore = create<State>((set) => ({
  showElem: CheckRole(),
  setShowElem: (showElem: boolean) => set({ showElem }),
}));

export default useHiderStore;
