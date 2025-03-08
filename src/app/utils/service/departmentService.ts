import { API_BASE } from "@/app/bindings/binding";
import apiClient from "@/app/http-common/apiUrl";
import { AddDepartmentFormField, Query } from "@/app/types/types";

const addDepartment = async (data: AddDepartmentFormField) => {
  return apiClient.post(`${API_BASE}/department`, {
    ...data,
  });
};

const fetchDepartmentById = async (id: number | undefined) => {
  return apiClient.get(`${API_BASE}/department/${id}`);
};

const fetchDepartments = async (params: Query) => {
  return apiClient.get(`${API_BASE}/department`, { params });
};

const updateDepartmentById = async (
  id: number | undefined,
  data: { departmentName: string; departmentCode: string; divisionId: number }
) => {
  return apiClient.put(`${API_BASE}/department/${id}`, {
    ...data,
  });
};

const removeDepartmentById = async (id: number | undefined) => {
  return apiClient.delete(`${API_BASE}/department/${id}`);
};

export {
  addDepartment,
  fetchDepartments,
  fetchDepartmentById,
  removeDepartmentById,
  updateDepartmentById,
};
