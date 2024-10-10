import { useEffect, useState } from "react";
import { User } from "../types/types";
import apiClient from "../http-common/apiUrl";
import { API_BASE, INTRANET } from "../bindings/binding";
import { toast } from "react-toastify";

const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await apiClient.get(`${API_BASE}/users`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(INTRANET)}`,
          },
        });

        const data = response.data;

        if (data.statusCode === 200) {
          setUsers(data.users.users);
        }
      } catch (error) {
        console.error(error);
        const { message } = error as { message: string };

        toast(message, { type: "error" });
      }
    };

    fetchUsers();
  }, []);

  return users;
};

export default useUsers;
