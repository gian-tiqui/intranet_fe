import { API_BASE } from "@/app/bindings/binding";
import apiClient from "@/app/http-common/apiUrl";
import { AxiosResponse } from "axios";

const getLandingPageData = async (): Promise<
  AxiosResponse<{
    postsCount: number;
    employeesCount: number;
    notificationsCount: number;
  }>
> => {
  return apiClient.get(`${API_BASE}/landing-page`);
};

export { getLandingPageData };
