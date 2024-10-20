import { jwtDecode } from "jwt-decode";
import { API_BASE, INTRANET } from "../bindings/binding";
import apiClient from "../http-common/apiUrl";

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

const fetchMonitoringData = async () => {
  const response = await apiClient.get(`${API_BASE}/monitoring/users`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem(INTRANET)}`,
    },
  });
  return response.data;
};

export { decodeUserData, checkDept, fetchMonitoringData };
