import { useEffect, useState } from "react";
import { Post } from "../types/types";
import apiClient from "../http-common/apiUrl";
import { API_BASE, INTRANET } from "../bindings/binding";
import { decodeUserData } from "../functions/functions";

const useHistory = () => {
  const [postReads, setPostReads] = useState<Post[]>([]);

  useEffect(() => {
    const fetchUserHistory = async () => {
      const response = await apiClient.get(
        `${API_BASE}/users/history/${decodeUserData()?.sub}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(INTRANET)}`,
          },
        }
      );

      setPostReads(response.data);
    };

    fetchUserHistory();
  }, []);

  return postReads;
};

export default useHistory;
