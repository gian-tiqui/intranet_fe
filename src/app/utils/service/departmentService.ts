import { API_BASE } from "@/app/bindings/binding";
import apiClient from "@/app/http-common/apiUrl";
import { Query } from "@/app/types/types";

const fetchDepartmentById = async (id: number) => {
  return apiClient.get(`${API_BASE}/department/${id}`);
};

const fetchDepartments = async (params: Query) => {
  return apiClient.get(`${API_BASE}/department`, { params });
};

export { fetchDepartments, fetchDepartmentById };
