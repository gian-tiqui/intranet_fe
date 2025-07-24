import { API_BASE } from "@/app/bindings/binding";
import apiClient from "@/app/http-common/apiUrl";

const getAllUserUpdates = async () => {
  return apiClient.get(`${API_BASE}/user-updates`);
};

const approveUserUpdate = async (userId: number) => {
  return apiClient.patch(`${API_BASE}/${userId}/user`);
};

export { getAllUserUpdates, approveUserUpdate };
