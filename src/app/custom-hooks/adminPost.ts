import { useState, useEffect } from "react";
import { Post } from "../types/types";
import apiClient from "../http-common/apiUrl";
import { API_BASE, INTRANET } from "../bindings/binding";

const useAdminPosts = () => {
  const [aPosts, setAPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchAllPosts = async () => {
      const response = await apiClient.get(`${API_BASE}/post`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem(INTRANET)}`,
        },
      });

      setAPosts(response.data);
    };

    fetchAllPosts();
  }, []);

  return aPosts;
};

export default useAdminPosts;
