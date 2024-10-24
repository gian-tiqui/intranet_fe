import { DepartmentMonitoring } from "@/app/types/types";
import React, { Dispatch, SetStateAction, useState } from "react";
import UserCard from "./UserCard";

interface Props {
  department?: DepartmentMonitoring;
  dept?: DepartmentMonitoring;
  setDept?: Dispatch<SetStateAction<DepartmentMonitoring | undefined>>;
  departments?: DepartmentMonitoring[];
}

const DepartmentUsers: React.FC<Props> = ({
  department,
  departments,
  dept,
  setDept,
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredUsers = department?.users.filter(
    (user) =>
      user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div className="w-full flex flex-col gap-2 md:gap-0 md:flex-row mb-3 justify-between">
        <input
          type="text"
          placeholder="Search"
          className="rounded-lg h-10 px-5 outline-none border border-gray-300 dark:border-neutral-950 dark:bg-neutral-900"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <select
          className="rounded-lg h-10 px-5 outline-none border border-gray-300 dark:border-neutral-950 dark:bg-neutral-900"
          onChange={(e) => {
            const selectedDept = departments?.find(
              (department: DepartmentMonitoring) =>
                department.departmentId === Number(e.target.value)
            );
            if (setDept) setDept(selectedDept);
          }}
          value={dept?.departmentId || ""}
        >
          <option value="" disabled>
            Select a Department
          </option>
          {departments?.map((department: DepartmentMonitoring) => (
            <option
              value={department.departmentId}
              key={department.departmentId}
            >
              {department.departmentName}
            </option>
          ))}
        </select>
      </div>
      <section className="flex flex-col gap-2 bg-white dark:bg-neutral-900 h-96 py-3 px-2 rounded-lg overflow-auto">
        {filteredUsers && filteredUsers.length > 0 ? (
          <>
            {filteredUsers.map((user) => (
              <UserCard key={user.userId} user={user} />
            ))}
          </>
        ) : (
          <div className="h-full w-full grid place-content-center">
            <p>Nothing to show here</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default DepartmentUsers;
