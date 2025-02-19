import { API_BASE } from "@/app/bindings/binding";
import apiClient from "@/app/http-common/apiUrl";

const fetchLevels = async () => {
  try {
    const response = await apiClient.get(`${API_BASE}/level`);

    const levels = response.data;

    return levels;
  } catch (error) {
    console.error(error);
  }
};

export default fetchLevels;
