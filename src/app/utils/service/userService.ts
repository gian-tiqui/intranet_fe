import { API_BASE } from "@/app/bindings/binding";
import apiClient from "@/app/http-common/apiUrl";
import { Query, User } from "@/app/types/types";
import { AxiosResponse } from "axios";

const addUser = async (data: User) => {
  return apiClient.post(`${API_BASE}/auth/register`, { ...data });
};

function omit<T extends object, K extends keyof T>(
  obj: T,
  keys: K[]
): Omit<T, K> {
  const result = { ...obj };
  keys.forEach((key) => {
    delete result[key];
  });
  return result;
}

const addUserV2 = async (data: User) => {
  const sanitizedData = omit(data, ["password"]);
  return apiClient.post(`${API_BASE}/users`, sanitizedData);
};

const findUsers = async (params: Query) => {
  return apiClient.get(`${API_BASE}/users`, { params });
};

const findUserById = async (
  id: number | undefined | null
): Promise<AxiosResponse<{ user: User }>> => {
  return apiClient.get(`${API_BASE}/users/${id}`);
};

const updateUserById = async (
  id: number | undefined,
  data: User | { isFirstLogin: boolean | number },
  updatedBy: number | undefined
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

const getDraftsByUserId = async (userId: number, params: Query) => {
  if (!params) return;
  return apiClient.get(`${API_BASE}/users/${userId}/drafts`, { params });
};

const getLastLogin = async (userId: number | null) => {
  if (!userId) return;

  return apiClient.get(`${API_BASE}/users/${userId}/last-login`);
};

const uploadProfilePicture = async (
  userId: number | undefined,
  formData: FormData
) => {
  return apiClient.post(`${API_BASE}/users/${userId}/upload`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

type UserUpdate = {
  address?: string;
  dob?: Date;
  firstName?: string;
  gender?: string;
  jobTitle?: string;
  lastName?: string;
  localNumber?: string;
  middleName?: string;
  officeLocation?: string;
  suffix?: string;
};

const updateUserProfile = async (
  userId: number | undefined,
  data: UserUpdate
) => {
  return apiClient.patch(`${API_BASE}/users/${userId}/profileUpdate`, {
    ...data,
  });
};

const getBookMarksByUserID = (userId: number | undefined) => {
  return apiClient.get(`${API_BASE}/users/${userId}/bookmarks`);
};

export {
  getBookMarksByUserID,
  updateUserProfile,
  getLastLogin,
  getDraftsByUserId,
  findUsers,
  addUser,
  deleteUserById,
  deactivateUser,
  findUserById,
  updateUserById,
  addUserV2,
  uploadProfilePicture,
};
