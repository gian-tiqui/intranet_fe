import { jwtDecode } from "jwt-decode";
import { API_BASE, INTRANET } from "../bindings/binding";
import apiClient from "../http-common/apiUrl";
import { NotificationType, Post } from "../types/types";

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

const fetchNotifs = async () => {
  try {
    const deptId = decodeUserData()?.deptId;
    const userId = decodeUserData()?.sub;
    const API_URI = `${API_BASE}/notification?deptId=${deptId}&userId=${userId}`;

    const response = await apiClient.get(API_URI);

    return response.data as NotificationType[];
  } catch (error) {
    console.error(error);
  }
};

const fetchPublicPosts = async () => {
  try {
    const response = await apiClient.get(`${API_BASE}/post?public=true`);

    return response.data as Post[];
  } catch (error) {
    console.error(error);
  }
};

const fetchPosts = async () => {
  try {
    const apiUri = `${API_BASE}/post?deptId=${
      decodeUserData()?.deptId
    }&userIdComment=${decodeUserData()?.sub}`;

    const response = await apiClient.get(apiUri, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem(INTRANET)}`,
      },
    });

    return response.data as Post[];
  } catch (error) {
    console.error(error);
  }
};

export {
  decodeUserData,
  checkDept,
  fetchMonitoringData,
  fetchNotifs,
  fetchPublicPosts,
  fetchPosts,
};
