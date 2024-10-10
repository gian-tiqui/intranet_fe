import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import apiClient from "../http-common/apiUrl";
import { API_BASE, INTRANET } from "../bindings/binding";

const useReplies = () => {
  const [replies, setReplies] = useState<Comment[]>([]);

  useEffect(() => {
    const fetchReplies = async () => {
      try {
        const response = await apiClient.get(`${API_BASE}/comment`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(INTRANET)}`,
          },
        });

        console.log(response);
      } catch (error) {
        console.error(error);
        const { message } = error as { message: string };

        toast(message, { type: "error" });
      }
    };

    fetchReplies();
  }, []);

  return replies;
};

export default useReplies;
