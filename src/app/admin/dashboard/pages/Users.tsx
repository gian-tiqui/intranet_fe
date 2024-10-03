"use client";
import { API_BASE, INTRANET } from "@/app/bindings/binding";
import apiClient from "@/app/http-common/apiUrl";
import { User } from "@/app/types/types";
import React, { useEffect, useState } from "react";
import UserCard from "../components/UserCard";

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await apiClient.get(`${API_BASE}/users`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem(INTRANET)}`,
        },
      });

      setUsers(response.data.users.users);
    };

    fetchUsers();
  }, []);

  return (
    <div className="grid gap-2 grid-cols-3">
      {users.map((user) => (
        <UserCard user={user} key={user.id} />
      ))}
    </div>
  );
};

export default Users;
