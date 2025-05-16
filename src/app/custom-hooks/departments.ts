import { useState, useEffect } from "react";
import { API_BASE, INTRANET } from "../bindings/binding";
import apiClient from "../http-common/apiUrl";
import { Department } from "../types/types";
import Cookies from "js-cookie";

const useDepartments = () => {
  const [departments, setDepartments] = useState<Department[]>([]);

  useEffect(() => {
    const fetchDepartments = async () => {
      const refreshToken = Cookies.get(INTRANET);

      if (!refreshToken) return;

      const response = await apiClient.get(`${API_BASE}/department`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem(INTRANET)}`,
        },
      });

      setDepartments(response.data.departments);
    };

    fetchDepartments();
  }, []);

  return departments;
};

export default useDepartments;
