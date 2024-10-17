import { useEffect, useState } from "react";
import { Post } from "../types/types";
import apiClient from "../http-common/apiUrl";
import { API_BASE } from "../bindings/binding";

const useBulletin = () => {
  const [publicPosts, setPublicPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchPublicPosts = async () => {
      try {
        const response = await apiClient.get(`${API_BASE}/post?public=true`);

        setPublicPosts(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchPublicPosts();
  }, []);

  return publicPosts;
};

export default useBulletin;
