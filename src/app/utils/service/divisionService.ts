import { API_BASE } from "@/app/bindings/binding";
import apiClient from "@/app/http-common/apiUrl";
import { Query } from "@/app/types/types";

const getDivisions = async (params: Query) => {
  return apiClient.get(`${API_BASE}/division`, { params });
};

export { getDivisions };
