import { jwtDecode } from "jwt-decode";
import { API_BASE, INTRANET } from "../bindings/binding";
import apiClient from "../http-common/apiUrl";
import { Decoder, NotificationType, Post, UnreadPost } from "../types/types";

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

export {
  fetchUserUnreads,
  decodeUserData,
  checkDept,
  fetchMonitoringData,
  fetchNotifs,
  fetchPublicPosts,
  fetchPosts,
};
