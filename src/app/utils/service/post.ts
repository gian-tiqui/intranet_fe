import { API_BASE } from "@/app/bindings/binding";
import { decodeUserData } from "@/app/functions/functions";
import apiClient from "@/app/http-common/apiUrl";

const fetchDeptPostsByLid = async () => {
  const lid = decodeUserData()?.lid;
  const deptId = decodeUserData()?.deptId;

  if (deptId && lid) {
    try {
      const response = await apiClient.get(
        `${API_BASE}/post/${deptId}/level/${lid}`
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

export { fetchDeptPostsByLid };
