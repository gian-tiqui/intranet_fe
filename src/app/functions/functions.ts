import { jwtDecode } from "jwt-decode";
import { INTRANET } from "../bindings/binding";

const decodeUserData = () => {
  const at = localStorage.getItem(INTRANET);
  if (at) {
    return jwtDecode<{
      departmentName: string;
      firstName: string;
      lastName: string;
      sub: number;
      email: string;
      deptId: number;
    }>(at);
  }
  return null;
};

export { decodeUserData };
