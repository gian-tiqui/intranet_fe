import { API_BASE } from "@/app/bindings/binding";
import apiClient from "@/app/http-common/apiUrl";
import { Folder, Query } from "@/app/types/types";
import { AxiosResponse } from "axios";

const getFolders = async (params: Query) => {
  return apiClient.get(`${API_BASE}/folders`, { params });
};

const getFolderById = async (folderId: number) => {
  return apiClient.get(`${API_BASE}/folders/${folderId}`);
};

const getFolderSubfolders = async (
  folderId: number,
  params: Query
): Promise<AxiosResponse<{ message: string; subfolders: Folder[] }>> => {
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
  userId,
  bookmarkDeptIds,
}: {
  name: string;
  isPublished: number;
  deptIds: string;
  userId: number;
  bookmarkDeptIds: string;
}) => {
  return apiClient.post(`${API_BASE}/folders`, {
    name,
    isPublished,
    deptIds,
    userId,
    bookmarkDeptIds,
  });
};

const addSubfolder = async ({
  name,
  isPublished,
  parentId,
  deptIds,
  userId,
  createDefaultFolders,
  bookmarkDeptIds,
}: {
  name: string;
  isPublished: number;
  parentId: number;
  deptIds: string;
  userId: number;
  createDefaultFolders?: number;
  bookmarkDeptIds: string;
}) => {
  return apiClient.post(`${API_BASE}/folders/${parentId}/subfolder`, {
    name,
    isPublished,
    deptIds,
    userId,
    createDefaultFolders,
    bookmarkDeptIds,
  });
};

const updateFolder = async (data: {
  folderId?: number;
  name?: string;
  deptIds?: string;
  isPublished?: number;
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
