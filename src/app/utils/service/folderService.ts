import { API_BASE } from "@/app/bindings/binding";
import apiClient from "@/app/http-common/apiUrl";
import { Query } from "@/app/types/types";

const getFolders = async (params: Query) => {
  return apiClient.get(`${API_BASE}/folders`, { params });
};

const getFolderById = async (folderId: number) => {
  return apiClient.get(`${API_BASE}/folders/${folderId}`);
};

const getFolderSubfolders = async (folderId: number, params: Query) => {
  if (!folderId) return;
  return apiClient.get(`${API_BASE}/folders/${folderId}/subfolder`, { params });
};

const getFolderPostsByFolderId = async (
  folderId: number | undefined,
  params: Query
) => {
  if (!folderId) return;
  return apiClient.get(`${API_BASE}/folders/${folderId}/post`, {
    params,
  });
};

const addMainFolder = async ({
  name,
  isPublished,
  deptIds,
}: {
  name: string;
  isPublished: number;
  deptIds: string;
}) => {
  return apiClient.post(`${API_BASE}/folders`, {
    name,
    isPublished,
    deptIds,
  });
};

const addSubfolder = async ({
  name,
  isPublished,
  parentId,
  deptIds,
}: {
  name: string;
  isPublished: number;
  parentId: number;
  deptIds: string;
}) => {
  return apiClient.post(`${API_BASE}/folders/${parentId}/subfolder`, {
    name,
    isPublished,
    deptIds,
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

export {
  getFolders,
  getFolderById,
  addMainFolder,
  updateFolder,
  deleteFolder,
  getFolderPostsByFolderId,
  addSubfolder,
  getFolderSubfolders,
};
