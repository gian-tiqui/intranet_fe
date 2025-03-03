import { API_BASE } from "@/app/bindings/binding";
import apiClient from "@/app/http-common/apiUrl";
import { Query } from "@/app/types/types";

const fetchDepartments = async (params: Query) => {
  return apiClient.get(`${API_BASE}/department`, { params });
};

export { fetchDepartments };
