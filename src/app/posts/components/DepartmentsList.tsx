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
    <div className="mb-4 absolute bg-white w-full p-2 border rounded">
      {departments.map((department) => (
        <div key={department.deptId} className="flex items-center">
          <input
            type="checkbox"
            id={`dept-${department.deptId}`}
            value={department.deptId}
            onChange={() => handleCheckboxChange(department.deptId.toString())}
            checked={selectedDepartments.includes(department.deptId.toString())}
          />
          <label htmlFor={`dept-${department.deptId}`} className="ml-2">
            {department.departmentName}
          </label>
        </div>
      ))}
    </div>
  );
};

export default DepartmentsList;
