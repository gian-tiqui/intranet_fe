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

const checkDept = () => {
  const userDeptId = decodeUserData()?.deptId;

  if (userDeptId) {
    const deptIds: number[] = [1, 2, 4]; // 4 is initial id for admin.

    if (!deptIds.includes(userDeptId)) {
      return false;
    }
  }

  return true;
};

export { decodeUserData, checkDept };
