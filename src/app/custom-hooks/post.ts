import { useEffect, useState } from "react";
import { Post } from "../types/types";
import { API_BASE, INTRANET } from "../bindings/binding";
import apiClient from "../http-common/apiUrl";

const usePost = (id: number) => {
  const [posts, setPosts] = useState<Post>();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await apiClient.get(`${API_BASE}/post/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(INTRANET)}`,
          },
        });

        setPosts(response.data.post);
      } catch (error) {
        console.error(error);
      }
    };

    fetchPosts();
  }, [id]);

  return posts;
};

export default usePost;
