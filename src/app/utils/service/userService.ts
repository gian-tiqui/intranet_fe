import { API_BASE } from "@/app/bindings/binding";
import apiClient from "@/app/http-common/apiUrl";
import { Query, User } from "@/app/types/types";
import { AxiosResponse } from "axios";

const addUser = async (data: User) => {
  return apiClient.post(`${API_BASE}/auth/register`, { ...data });
};

const findUsers = async (params: Query) => {
  return apiClient.get(`${API_BASE}/users`, { params });
};

const findUserById = async (
  id: number | undefined
): Promise<AxiosResponse<{ user: User }>> => {
  return apiClient.get(`${API_BASE}/users/${id}`);
};

const updateUserById = async (
  id: number | undefined,
  data: User,
  updatedBy: number
) => {
  return apiClient.put(`${API_BASE}/users/${id}`, { ...data, updatedBy });
};

const deleteUserById = async (userId: number | undefined) => {
  return apiClient.delete(`${API_BASE}/users/${userId}`);
};

const deactivateUser = async ({
  deactivatorId,
  employeeId,
  password,
}: {
  deactivatorId: number;
  employeeId: string;
  password: string;
}) => {
  return apiClient.post(
    `${API_BASE}/users/deactivate?deactivatorId=${deactivatorId}&employeeId=${employeeId}&password=${password}`
  );
};

export {
  findUsers,
  addUser,
  deleteUserById,
  deactivateUser,
  findUserById,
  updateUserById,
};
