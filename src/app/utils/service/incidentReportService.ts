import { API_BASE } from "@/app/bindings/binding";
import apiClient from "@/app/http-common/apiUrl";
import {
  CreateIncidentReportDto,
  IncidentReport,
  Query,
} from "@/app/types/types";
import { AxiosResponse } from "axios";

const createIncidentReport = async (payload: CreateIncidentReportDto) => {
  return apiClient.post(`${API_BASE}/incident-report`, { ...payload });
};

const getIncidentReportById = async (
  incidentReportId: number
): Promise<
  AxiosResponse<{ message: string; incidentReport: IncidentReport }>
> => {
  return apiClient.get(`${API_BASE}/incident-report/${incidentReportId}`);
};

const getIncidentReports = async (
  params: Query
): Promise<
  AxiosResponse<{ message: string; incidentReports: IncidentReport[] }>
> => {
  return apiClient.get(`${API_BASE}/incident-report`, { params });
};

const getIncidentReportCount = async (): Promise<
  AxiosResponse<{ message: string; counts: { ["key"]: number } }>
> => {
  return apiClient.get(`${API_BASE}/incident-report/1/counts`);
};

export {
  getIncidentReports,
  createIncidentReport,
  getIncidentReportById,
  getIncidentReportCount,
};
