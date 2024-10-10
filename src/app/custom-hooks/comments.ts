import { useEffect, useState } from "react";
import apiClient from "../http-common/apiUrl";
import { API_BASE, INTRANET } from "../bindings/binding";
import { toast } from "react-toastify";
import { Comment } from "../types/types";

const useComments = () => {
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await apiClient.get(`${API_BASE}/comment`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(INTRANET)}`,
          },
        });

        if (response.status === 200) {
          console.log(response.data);
          setComments(response.data);
        } else {
          console.log("There was a problem in fetching the comments");
        }
      } catch (error) {
        console.error(error);
        const { message } = error as { message: string };

        toast(message, { type: "error" });
      }
    };

    fetchComments();
  }, []);

  return comments;
};

export default useComments;
