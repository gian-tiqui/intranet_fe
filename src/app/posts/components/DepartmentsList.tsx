import { Department } from "@/app/types/types";
import React from "react";

interface Props {
  departments: Department[];
  selectedDepartments: string[];
  handleCheckboxChange: (deptId: string) => void;
}

const DepartmentsList: React.FC<Props> = ({
  departments,
  selectedDepartments,
  handleCheckboxChange,
}) => {
  return (
    <div className="mb-4 absolute bottom-5 left-9 bg-white dark:bg-neutral-950 w-[80%] p-2 border dark:border-black rounded-lg">
      {departments
        .filter((department) => department.users.length > 0)
        .map((department) => (
          <div key={department.deptId} className="flex items-center">
            <input
              type="checkbox"
              id={`dept-${department.deptId}`}
              value={department.deptId}
              onChange={() =>
                handleCheckboxChange(department.deptId.toString())
              }
              checked={selectedDepartments.includes(
                department.deptId.toString()
              )}
            />
            <label
              htmlFor={`dept-${department.deptId}`}
              className="ml-2 text-sm"
            >
              {department.departmentName}
            </label>
          </div>
        ))}
    </div>
  );
};

export default DepartmentsList;
