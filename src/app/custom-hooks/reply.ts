import { useEffect, useState } from "react";
import { PostComment } from "../types/types";
import apiClient from "../http-common/apiUrl";
import { API_BASE } from "../bindings/binding";

const useReply = (cid: number) => {
  const [replies, setReplies] = useState<PostComment[]>([]);

  useEffect(() => {
    const fetchCommentReplies = async () => {
      const response = await apiClient.get(
        `${API_BASE}/comment/replies?parentId=${cid}`
      );

      setReplies(response.data);
    };

    fetchCommentReplies();
  }, [cid]);

  return replies;
};

export default useReply;
