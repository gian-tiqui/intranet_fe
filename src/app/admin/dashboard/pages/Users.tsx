"use client";
import { API_BASE, INTRANET } from "@/app/bindings/binding";
import apiClient from "@/app/http-common/apiUrl";
import { User } from "@/app/types/types";
import { formatDate } from "date-fns";
import React, { useEffect, useState } from "react";

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
    <div className="p-4 overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200 dark:bg-black dark:border-gray-600 shadow-md">
        <thead className="bg-gray-200 text-gray-600 uppercase text-sm">
          <tr>
            <th className="py-3 px-4 border-b">FIRST NAME</th>
            <th className="py-3 px-4 border-b">MIDDLE NAME</th>
            <th className="py-3 px-4 border-b">LAST NAME</th>
            <th className="py-3 px-4 border-b">EMAIL</th>
            <th className="py-3 px-4 border-b">LAST NAME PREFIX</th>
            <th className="py-3 px-4 border-b">PREFERRED NAME</th>
            <th className="py-3 px-4 border-b">SUFFIX</th>
            <th className="py-3 px-4 border-b">ADDRESS</th>
            <th className="py-3 px-4 border-b">CITY</th>
            <th className="py-3 px-4 border-b">STATE</th>
            <th className="py-3 px-4 border-b">ZIP CODE</th>
            <th className="py-3 px-4 border-b">DOB</th>
            <th className="py-3 px-4 border-b">GENDER</th>
            <th className="py-3 px-4 border-b">DEPARTMENT ID</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-gray-100">
              <td className="py-2 px-4 border-b">{user.firstName}</td>
              <td className="py-2 px-4 border-b">{user.middleName}</td>
              <td className="py-2 px-4 border-b">{user.lastName}</td>
              <td className="py-2 px-4 border-b">{user.email}</td>
              <td className="py-2 px-4 border-b">{user.lastNamePrefix}</td>
              <td className="py-2 px-4 border-b">{user.preferredName}</td>
              <td className="py-2 px-4 border-b">{user.suffix}</td>
              <td className="py-2 px-4 border-b">{user.address}</td>
              <td className="py-2 px-4 border-b">{user.city}</td>
              <td className="py-2 px-4 border-b">{user.state}</td>
              <td className="py-2 px-4 border-b">{user.zipCode}</td>
              <td className="py-2 px-4 border-b">
                {formatDate(user.dob, "MMMM dd, yyyy")}
              </td>
              <td className="py-2 px-4 border-b">{user.gender}</td>
              <td className="py-2 px-4 border-b">{user.deptId}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Users;
