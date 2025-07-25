import { API_BASE } from "@/app/bindings/binding";
import apiClient from "@/app/http-common/apiUrl";
import { Query } from "@/app/types/types";

const getAllUserUpdates = async (params: Query) => {
  return apiClient.get(`${API_BASE}/user-updates`, {
    params,
  });
};

const approveUserUpdate = async (userId: number) => {
  return apiClient.patch(`${API_BASE}/user-updates/${userId}/user`);
};

const rejectUserUpdate = async (userUpdateId: number) => {
  return apiClient.delete(`${API_BASE}/user-updates/${userUpdateId}`);
};

export { getAllUserUpdates, approveUserUpdate, rejectUserUpdate };
