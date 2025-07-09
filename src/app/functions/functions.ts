import { jwtDecode } from "jwt-decode";
import { API_BASE, INTRANET } from "../bindings/binding";
import apiClient from "../http-common/apiUrl";
import {
  CommentsProp,
  Decoder,
  DepartmentWithIncompleteReads,
  Folder,
  Level,
  LogType,
  NotificationType,
  Post,
  Query,
  RetPost,
  UnreadPost,
  User,
} from "../types/types";

const decodeUserData = () => {
  // Check if we're in a browser environment
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const at = localStorage.getItem(INTRANET);
    if (at) {
      return jwtDecode<Decoder>(at);
    }
  } catch (error) {
    console.error("Error decoding user data:", error);
  }

  return null;
};

const checkDept = () => {
  // Check if we're in a browser environment
  if (typeof window === "undefined") {
    return false;
  }

  try {
    const userDeptCode = decodeUserData()?.departmentCode?.toLowerCase();

    if (userDeptCode) {
      const depts: string[] = ["hr", "qm", "mrkt"];

      if (!depts.includes(userDeptCode)) {
        return false;
      }
    }

    return true;
  } catch (error) {
    console.error("Error checking department:", error);
    return false;
  }
};

const fetchMonitoringData = async () => {
  if (typeof window === "undefined") {
    throw new Error(
      "fetchMonitoringData can only be called on the client side"
    );
  }

  const response = await apiClient.get(`${API_BASE}/monitoring/users`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem(INTRANET)}`,
    },
  });
  return response.data;
};

const fetchNotifs = async () => {
  try {
    const userData = decodeUserData();
    if (!userData) return [];

    const deptId = userData.deptId;
    const userId = userData.sub;
    const lid = userData.lid;
    const API_URI = `${API_BASE}/notification?deptId=${deptId}&userId=${userId}&lid=${lid}`;

    const response = await apiClient.get(API_URI);

    return response.data as NotificationType[];
  } catch (error) {
    console.error(error);
    return [];
  }
};

const fetchPublicPosts = async () => {
  const userData = decodeUserData();
  if (userData) {
    try {
      const response = await apiClient.get(
        `${API_BASE}/post?lid=${userData.lid}&public=true&userIdComment=${
          userData.sub
        }&isPublished=${1}`
      );

      return response.data as RetPost;
    } catch (error) {
      console.error(error);
    }
  }
  return { posts: [] };
};

const fetchPosts = async () => {
  const userData = decodeUserData();
  if (userData) {
    try {
      const apiUri = `${API_BASE}/post?lid=${userData.lid}&deptId=${userData.deptId}&lid=${userData.lid}&userIdComment=${userData.sub}`;

      const response = await apiClient.get(apiUri, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem(INTRANET)}`,
        },
      });

      return response.data as RetPost;
    } catch (error) {
      console.error(error);
    }
  }
  return { posts: [] };
};

const fetchUserUnreads = async () => {
  try {
    const userData = decodeUserData();
    if (!userData) return [];

    const apiUri = `${API_BASE}/notification/unreads/${userData.sub}?deptId=${userData.deptId}`;
    const response = await apiClient.get(apiUri, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem(INTRANET)}`,
      },
    });

    return response.data.unreadPosts as UnreadPost[];
  } catch (error) {
    console.error(error);
    return [];
  }
};

const fetchAllLevels = async () => {
  if (typeof window === "undefined") {
    throw new Error("fetchAllLevels can only be called on the client side");
  }

  try {
    const response = await apiClient.get(`${API_BASE}/level`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem(INTRANET)}`,
      },
    });

    return response.data as Level[];
  } catch (error) {
    console.error(error);
    return [];
  }
};

const fetchPostsByLevel = async () => {
  try {
    const userData = decodeUserData();
    if (!userData) return { posts: [] };

    const response = await apiClient.get(
      `${API_BASE}/post/level/${userData.lid}?deptId=${
        userData.deptId
      }&isPublished=${1}`
    );

    return response.data as RetPost;
  } catch (error) {
    console.error(error);
    return { posts: [] };
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
    const userData = decodeUserData();
    if (!userData) return [];

    const response = await apiClient.get(
      `${API_BASE}/users?confirm=false&deptId=${userData.deptId}`
    );

    return response.data.users as User[];
  } catch (error) {
    console.error(error);
    return [];
  }
};

const fetchPost = async (id: number) => {
  try {
    const userData = decodeUserData();
    if (!userData) return null;

    let userCommentId;
    if (
      userData.departmentCode?.toLowerCase() === "hr" ||
      userData.departmentCode?.toLowerCase() === "qm"
    )
      userCommentId = "";
    else userCommentId = userData.sub;

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

const fetchMainFolders = async (
  query?: Query
): Promise<{ folders: Folder[]; count: number }> => {
  try {
    const response = await apiClient.get(`${API_BASE}/folders`, {
      params: query,
    });

    const folders = response.data.folders;
    const count = response.data.count;

    return {
      folders,
      count,
    };
  } catch (error) {
    console.error(error);
    return {
      folders: [],
      count: 0,
    };
  }
};

const getPostsFromSubfolderById = async (id: number): Promise<Post[]> => {
  try {
    const response = await apiClient.get(`${API_BASE}/folders/${id}/all-posts`);

    const posts = response.data;

    return posts;
  } catch (error) {
    console.error(error);
    return [];
  }
};

const getFolderById = async (
  id: number | undefined,
  deptId?: number | undefined
): Promise<Folder | null> => {
  if (!id) return null;

  try {
    const response = await apiClient.get(
      `${API_BASE}/folders/${id}?deptId=${deptId}`
    );

    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error(error);
    return null;
  }

  return null;
};

export {
  getFolderById,
  getPostsFromSubfolderById,
  fetchMainFolders,
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
