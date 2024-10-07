import { useEffect, useState } from "react";
import { Post } from "../types/types";
import { API_BASE, INTRANET } from "../bindings/binding";
import apiClient from "../http-common/apiUrl";
import { jwtDecode } from "jwt-decode";

const usePosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const at = localStorage.getItem(INTRANET);
        let deptIdQuery: string | null;

        if (!at) return;
        const decoded: { deptId: number } = jwtDecode(at);

        if (decoded.deptId === 1 || decoded.deptId === 2) deptIdQuery = "";
        else deptIdQuery = String(decoded.deptId);

        const apiUri = `${API_BASE}/post?deptId=${deptIdQuery}`;

        const response = await apiClient.get(apiUri, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(INTRANET)}`,
          },
        });

        setPosts(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchPosts();
  }, []);

  return posts;
};

export default usePosts;
