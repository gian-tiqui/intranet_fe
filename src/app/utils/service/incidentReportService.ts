import { API_BASE } from "@/app/bindings/binding";
import apiClient from "@/app/http-common/apiUrl";
import { CreateIncidentReportDto, Query } from "@/app/types/types";

const createIncidentReport = async (payload: CreateIncidentReportDto) => {
  return apiClient.post(`${API_BASE}/incident-report`, { ...payload });
};

const getIncidentReport = async (params: Query) => {
  return apiClient.get(`${API_BASE}/incident-report`, { params });
};

export { getIncidentReport, createIncidentReport };
