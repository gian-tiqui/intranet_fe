import axios from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { INTRANET } from "../bindings/binding";

export const API_URI = process.env.NEXT_PUBLIC_API_URL;

const apiClient = axios.create({
  baseURL: API_URI,
  withCredentials: true,
});

const isTokenExpired = (token: string) => {
  if (!token) return true;

  const { exp } = jwtDecode(token);

  if (!exp) throw new Error("Token does not have a valid exp");
  return Date.now() >= exp * 1000;
};

apiClient.interceptors.request.use(
  async (config) => {
    let accessToken = localStorage.getItem(INTRANET);

    // ✅ If no access token, skip refresh and return config
    if (!accessToken) {
      return config;
    }

    // ✅ If token exists but is expired, attempt refresh
    if (isTokenExpired(accessToken)) {
      const refreshToken = Cookies.get(INTRANET);

      if (!refreshToken) {
        console.warn("No refresh token found.");
        return config;
      }

      try {
        const response = await axios.post(
          `${API_URI}/auth/refresh`,
          { refreshToken },
          { withCredentials: true }
        );

        accessToken = response.data.access_token;

        if (!accessToken) {
          Cookies.remove(INTRANET);
          localStorage.removeItem(INTRANET);
          throw new Error("No access token returned from refresh.");
        }

        localStorage.setItem(INTRANET, accessToken);
      } catch (error) {
        console.error("Token refresh failed:", error);
        return Promise.reject(error);
      }
    }

    // ✅ Attach token if available
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      localStorage.getItem(INTRANET)
    ) {
      originalRequest._retry = true;

      const refreshToken = Cookies.get(INTRANET);

      if (!refreshToken) {
        console.warn("No refresh token found in response interceptor.");
        return Promise.reject(error);
      }

      try {
        const response = await axios.post(
          `${API_URI}/auth/refresh`,
          { refreshToken },
          { withCredentials: true }
        );

        const accessToken = response.data.access_token;

        if (!accessToken) {
          Cookies.remove(INTRANET);
          localStorage.removeItem(INTRANET);
          throw new Error("No access token returned from refresh.");
        }

        localStorage.setItem(INTRANET, accessToken);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        return apiClient(originalRequest);
      } catch (refreshError) {
        console.error("Refresh token failed in response:", refreshError);
        return Promise.reject(refreshError);
      }
    }

    console.error("API Error:", error);
    return Promise.reject(error);
  }
);

export default apiClient;
