import { API_BASE } from "@/app/bindings/binding";
import apiClient from "@/app/http-common/apiUrl";

const getFolderById = async (folderId: number) => {
  return apiClient.get(`${API_BASE}/folders/${folderId}`);
};

const addMainFolder = async (name: string) => {
  return apiClient.post(`${API_BASE}/folders`, {
    name,
  });
};

const updateFolder = async (data: { folderId?: number; name: string }) => {
  return apiClient.put(`${API_BASE}/folders/${data.folderId}`, {
    name: data.name,
  });
};

const deleteFolder = async (folderId: number) => {
  return apiClient.delete(`${API_BASE}/folders/${folderId}`);
};

export { getFolderById, addMainFolder, updateFolder, deleteFolder };
