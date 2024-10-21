import { DepartmentMonitoring } from "@/app/types/types";
import React, { Dispatch, SetStateAction } from "react";
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
  return (
    <div>
      <div className="w-full flex mb-3 justify-between">
        <input
          placeholder="Search"
          className="rounded-lg h-10 px-5 outline-none border border-gray-300 dark:border-neutral-950 dark:bg-neutral-900"
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
      <section className="grid grid-cols-1 gap-4 bg-white dark:bg-neutral-900 h-96 py-3 px-2 rounded-lg overflow-auto">
        {department?.users.map((user) => (
          <UserCard key={user.userId} user={user} />
        ))}
      </section>
    </div>
  );
};

export default DepartmentUsers;
