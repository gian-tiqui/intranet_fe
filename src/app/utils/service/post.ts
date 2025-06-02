import { API_BASE } from "@/app/bindings/binding";
import { decodeUserData } from "@/app/functions/functions";
import apiClient from "@/app/http-common/apiUrl";
import { Query } from "@/app/types/types";

const fetchDeptPostsByLid = async () => {
  const lid = decodeUserData()?.lid;
  const deptId = decodeUserData()?.deptId;

  if (deptId && lid) {
    try {
      const response = await apiClient.get(
        `${API_BASE}/post/${deptId}/level/${lid}?isPublished=${1}`
      );

      return {
        posts: response.data.posts,
        count: response.data.count,
      };
    } catch (error) {
      console.error(error);

      return {
        posts: [],
        count: 0,
      };
    }
  }
};

const getPostRevisions = async (postId: number, params: Query) => {
  return apiClient.get(`${API_BASE}/post/${postId}/revisions}`, { params });
};

export { fetchDeptPostsByLid, getPostRevisions };
