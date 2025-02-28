import { API_BASE } from "@/app/bindings/binding";
import apiClient from "@/app/http-common/apiUrl";
import { Query } from "@/app/types/types";

const getFolders = async (params: Query) => {
  return apiClient.get(`${API_BASE}/folders`, { params });
};

const getFolderById = async (folderId: number) => {
  return apiClient.get(`${API_BASE}/folders/${folderId}`);
};

const addMainFolder = async ({
  name,
  textColor,
  folderColor,
}: {
  name: string;
  textColor?: string;
  folderColor?: string;
}) => {
  return apiClient.post(`${API_BASE}/folders`, {
    name,
    textColor,
    folderColor,
  });
};

const updateFolder = async (data: {
  folderId?: number;
  name?: string;
  textColor?: string;
  folderColor?: string;
}) => {
  const { folderId, ...body } = data;
  return apiClient.put(`${API_BASE}/folders/${folderId}`, {
    ...body,
  });
};

const deleteFolder = async (folderId: number) => {
  return apiClient.delete(`${API_BASE}/folders/${folderId}`);
};

export { getFolders, getFolderById, addMainFolder, updateFolder, deleteFolder };
