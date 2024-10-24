import { useEffect, useState } from "react";
import { Post } from "../types/types";
import { API_BASE, INTRANET } from "../bindings/binding";
import apiClient from "../http-common/apiUrl";
import { decodeUserData } from "../functions/functions";

const usePosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const apiUri = `${API_BASE}/post?deptId=${
          decodeUserData()?.deptId
        }&userIdComment=${decodeUserData()?.sub}&lid=4`;

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
