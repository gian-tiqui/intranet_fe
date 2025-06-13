import { API_BASE } from "@/app/bindings/binding";
import apiClient from "@/app/http-common/apiUrl";

const getPostTypes = async () => {
  return apiClient.get(`${API_BASE}/post-types`);
};

export { getPostTypes };
