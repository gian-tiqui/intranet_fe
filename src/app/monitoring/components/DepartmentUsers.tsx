import { DepartmentMonitoring } from "@/app/types/types";
import React, { Dispatch, SetStateAction, useState } from "react";
import UserCard from "./UserCard";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";

interface Props {
  department?: DepartmentMonitoring;
  dept?: DepartmentMonitoring;
  setDept?: Dispatch<SetStateAction<DepartmentMonitoring | undefined>>;
  departments?: DepartmentMonitoring[];
}

const DepartmentUsers: React.FC<Props> = ({
  department,
  departments,
  setDept,
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredUsers = (department?.users ?? [])
    .filter(
      (user) =>
        user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => a.firstName.localeCompare(b.firstName));

  const groupedUsers: { [key: string]: typeof filteredUsers } = {};
  filteredUsers.forEach((user) => {
    const firstLetter = user.firstName[0].toUpperCase();
    if (!groupedUsers[firstLetter]) {
      groupedUsers[firstLetter] = [];
    }
    groupedUsers[firstLetter].push(user);
  });

  return (
    <div className="w-[90%] mx-auto pt-6">
      <h1 className="text-blue-600 text-2xl font-bold mb-6">
        Users Read Monitoring
      </h1>

      <div className="w-full flex flex-col md:flex-row gap-3 md:gap-4 mb-6 justify-between">
        <InputText
          type="text"
          placeholder="Search by name..."
          className="w-full md:w-1/2 text-sm px-4 py-2 bg-[#EEEEEE] dark:bg-neutral-800 text-black dark:text-white rounded-xl shadow border-none focus:ring-2 focus:ring-blue-500"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <Dropdown
          options={departments}
          className="w-full md:w-1/2 bg-[#EEEEEE] dark:bg-neutral-800 text-black dark:text-white rounded-xl shadow border-none"
          pt={{
            input: { className: "text-sm" },
            item: { className: "text-sm" },
          }}
          value={department}
          optionLabel="departmentName"
          filter
          onChange={(e) => {
            const dept = e.value;
            if (dept && setDept) setDept(dept);
          }}
        />
      </div>

      <section className="flex flex-col gap-6">
        {filteredUsers.length > 0 ? (
          Object.keys(groupedUsers)
            .sort()
            .map((letter) => (
              <div key={letter}>
                <h2 className="text-lg font-bold text-blue-600 mb-3">
                  {letter}
                </h2>
                <div className="bg-[#EEEEEE] dark:bg-neutral-800 rounded-xl shadow px-4 py-3 flex flex-col gap-2">
                  {groupedUsers[letter].map((user, index) => (
                    <UserCard key={user.userId} user={user} index={index} />
                  ))}
                </div>
              </div>
            ))
        ) : (
          <div className="w-full h-40 grid place-content-center text-center text-gray-500">
            <p>No users found matching your search.</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default DepartmentUsers;
