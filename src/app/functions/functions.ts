import { jwtDecode } from "jwt-decode";
import { API_BASE, INTRANET } from "../bindings/binding";
import apiClient from "../http-common/apiUrl";
import {
  CommentsProp,
  Decoder,
  DepartmentWithIncompleteReads,
  Level,
  LogType,
  NotificationType,
  Post,
  RetPost,
  UnreadPost,
  User,
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
      `${API_BASE}/post?lid=${
        decodeUserData()?.lid
      }&public=true&userIdComment=${decodeUserData()?.sub}`
    );

    return response.data as RetPost;
  } catch (error) {
    console.error(error);
  }
};

const fetchPosts = async () => {
  try {
    const apiUri = `${API_BASE}/post?lid=${decodeUserData()?.lid}&deptId=${
      decodeUserData()?.deptId
    }&lid=${decodeUserData()?.lid}&userIdComment=${decodeUserData()?.sub}`;

    const response = await apiClient.get(apiUri, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem(INTRANET)}`,
      },
    });

    return response.data as RetPost;
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

    return response.data as RetPost;
  } catch (error) {
    console.error(error);
  }
};

const aggregateCommentsPerPost = (comments: CommentsProp["comments"]) => {
  const countByPost: Record<number, number> = {};
  comments.forEach((comment) => {
    countByPost[comment.postId] = (countByPost[comment.postId] || 0) + 1;
  });
  return Object.entries(countByPost).map(([postId, count]) => ({
    postId: Number(postId),
    count,
  }));
};

const aggregateReadersPerPost = (posts: Post[]) => {
  return posts.map((post) => ({
    postId: post.pid,
    readers: post.readers.length,
  }));
};

const aggregatePostsByDay = (posts: Post[]) => {
  const countByDay: Record<string, number> = {};

  posts.forEach((post) => {
    const day = new Date(post.createdAt).toLocaleDateString();
    countByDay[day] = (countByDay[day] || 0) + 1;
  });

  return Object.entries(countByDay).map(([day, count]) => ({
    date: day,
    count,
  }));
};

const aggregatePostsByMonth = (posts: Post[]) => {
  const countByMonth: Record<string, number> = {};

  posts.forEach((post) => {
    const month = new Date(post.createdAt).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
    countByMonth[month] = (countByMonth[month] || 0) + 1;
  });

  return Object.entries(countByMonth).map(([month, count]) => ({
    date: month,
    count,
  }));
};

const aggregatePostsByYear = (posts: Post[]) => {
  const countByYear: Record<string, number> = {};

  posts.forEach((post) => {
    const year = new Date(post.createdAt).getFullYear().toString();
    countByYear[year] = (countByYear[year] || 0) + 1;
  });

  return Object.entries(countByYear).map(([year, count]) => ({
    date: year,
    count,
  }));
};

export const fetchUsersWithIncompleteReads = async () => {
  const response = await apiClient.get<DepartmentWithIncompleteReads[]>(
    "/monitoring/users"
  );

  return response.data.map((dept) => ({
    departmentName: dept.departmentName,
    userCount: dept.users.length,
  }));
};

const fetchPostDeptIds = async (pid: number): Promise<string[]> => {
  try {
    const response = await apiClient.get(
      `${API_BASE}/post-department/deptIds?postId=${pid}`
    );

    const deptIds: string[] = response.data.deptIds.split(",");

    return deptIds;
  } catch (error) {
    console.error(error);
    return [];
  }
};

const fetchLogsByTypeId = async (logType: number): Promise<LogType[]> => {
  try {
    const response = await apiClient.get(
      `${API_BASE}/edit-logs?editTypeId=${logType}`
    );

    return response.data;
  } catch (error) {
    console.error(error);
    return [];
  }
};

const fetchPendingUsers = async () => {
  try {
    const response = await apiClient.get(
      `${API_BASE}/users?confirm=false&deptId=${decodeUserData()?.deptId}`
    );

    return response.data.users.users as User[];
  } catch (error) {
    console.error(error);
    return [];
  }
};

const fetchPost = async (id: number) => {
  try {
    let userCommentId;
    if (
      decodeUserData()?.departmentCode.toLowerCase() === "hr" ||
      decodeUserData()?.departmentCode.toLowerCase() === "qm"
    )
      userCommentId = "";
    else userCommentId = decodeUserData()?.sub;

    const response = await apiClient.get(
      `${API_BASE}/post/${id}?userIdComment=${userCommentId}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem(INTRANET)}`,
        },
      }
    );

    return response.data.post as Post;
  } catch (error) {
    console.error(error);

    return null;
  }
};

export {
  fetchPost,
  fetchPendingUsers,
  fetchLogsByTypeId,
  fetchPostDeptIds,
  aggregatePostsByMonth,
  aggregatePostsByDay,
  aggregatePostsByYear,
  fetchPostsByLevel,
  aggregateCommentsPerPost,
  aggregateReadersPerPost,
  fetchAllLevels,
  fetchUserUnreads,
  decodeUserData,
  checkDept,
  fetchMonitoringData,
  fetchNotifs,
  fetchPublicPosts,
  fetchPosts,
};
