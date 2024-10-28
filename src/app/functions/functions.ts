import { jwtDecode } from "jwt-decode";
import { API_BASE, INTRANET } from "../bindings/binding";
import apiClient from "../http-common/apiUrl";
import {
  Decoder,
  Level,
  NotificationType,
  Post,
  UnreadPost,
} from "../types/types";

const decodeUserData = () => {
  const at = localStorage.getItem(INTRANET);
  if (at) {
    return jwtDecode<Decoder>(at);
  }
  return null;
};

const checkDept = () => {
  const userDeptCode = decodeUserData()?.departmentCode.toLowerCase();

  if (userDeptCode) {
    const depts: string[] = ["hr", "qm", "admin"];

    if (!depts.includes(userDeptCode)) {
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
    const lid = decodeUserData()?.lid;
    const API_URI = `${API_BASE}/notification?deptId=${deptId}&userId=${userId}&lid=${lid}`;

    const response = await apiClient.get(API_URI);

    return response.data as NotificationType[];
  } catch (error) {
    console.error(error);
  }
};

const fetchPublicPosts = async () => {
  try {
    const response = await apiClient.get(
      `${API_BASE}/post?lid=${decodeUserData()?.lid}&public=true`
    );

    return response.data as Post[];
  } catch (error) {
    console.error(error);
  }
};

const fetchPosts = async () => {
  try {
    const apiUri = `${API_BASE}/post?lid=${decodeUserData()?.lid}&deptId=${
      decodeUserData()?.deptId
    }&lid=${decodeUserData()?.lid}`;

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

const fetchUserUnreads = async () => {
  try {
    const apiUri = `${API_BASE}/notification/unreads/${
      decodeUserData()?.sub
    }?deptId=${decodeUserData()?.deptId}`;
    const response = await apiClient.get(apiUri, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem(INTRANET)}`,
      },
    });

    return response.data.unreadPosts as UnreadPost[];
  } catch (error) {
    console.error(error);
  }
};

const fetchAllLevels = async () => {
  try {
    const response = await apiClient.get(`${API_BASE}/level`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem(INTRANET)}`,
      },
    });

    return response.data as Level[];
  } catch (error) {
    console.error(error);
  }
};

const fetchPostsByLevel = async () => {
  try {
    const response = await apiClient.get(
      `${API_BASE}/post/level/${decodeUserData()?.lid}?deptId=${
        decodeUserData()?.deptId
      }`
    );

    return response.data as Post[];
  } catch (error) {
    console.error(error);
  }
};

export {
  fetchPostsByLevel,
  fetchAllLevels,
  fetchUserUnreads,
  decodeUserData,
  checkDept,
  fetchMonitoringData,
  fetchNotifs,
  fetchPublicPosts,
  fetchPosts,
};
