import axios from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { INTRANET } from "../bindings/binding";

export const API_URI = process.env.NEXT_PUBLIC_API_URL;

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

const isTokenExpired = (token: string) => {
  if (!token) return true;

  const { exp } = jwtDecode(token);

  if (!exp) throw new Error("Token does not have a valid exp");
  if (Date.now() >= exp * 1000) {
    return true;
  }

  return false;
};

apiClient.interceptors.request.use(
  async (config) => {
    let accessToken = localStorage.getItem(INTRANET);

    if (accessToken && isTokenExpired(accessToken)) {
      try {
        const refreshToken = Cookies.get(INTRANET);
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
          { refreshToken },
          { withCredentials: true }
        );

        accessToken = response.data.access_token;

        if (!accessToken) throw new Error("No token was generated");

        localStorage.setItem(INTRANET, accessToken);
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        return Promise.reject(refreshError);
      }
    }

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
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = Cookies.get(INTRANET);
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
          { refreshToken },
          { withCredentials: true }
        );

        const { accessToken } = response.data;
        localStorage.setItem(INTRANET, accessToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        console.error("Refresh token failed:", refreshError);
        return Promise.reject(refreshError);
      }
    }

    console.error("API Error:", error);
    return Promise.reject(error);
  }
);

export default apiClient;
