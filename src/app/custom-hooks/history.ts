import { Post } from "../types/types";
import apiClient from "../http-common/apiUrl";
import { API_BASE, INTRANET } from "../bindings/binding";
import { decodeUserData } from "../functions/functions";
import usePostUriStore from "../store/usePostUri";

const useHistory = async (): Promise<
  { createdAt: string; updatedAt: string; post: Post }[]
> => {
  const { uriPost } = usePostUriStore.getState();

  const response = await apiClient.get(
    `${API_BASE}/users/history/${decodeUserData()?.sub}?search=${uriPost}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem(INTRANET)}`,
      },
    }
  );

  return response.data;
};

export default useHistory;
