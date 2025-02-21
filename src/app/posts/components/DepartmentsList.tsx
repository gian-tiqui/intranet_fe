import { Department } from "@/app/types/types";
import { Button } from "primereact/button";
import React, { Dispatch, SetStateAction } from "react";

interface Props {
  departments: Department[];
  selectedDepartments: string[];
  handleCheckboxChange: (deptId: string) => void;
  setSelectedDepartments: Dispatch<SetStateAction<string[]>>;
}

const DepartmentsList: React.FC<Props> = ({
  departments,
  selectedDepartments,
  handleCheckboxChange,
  setSelectedDepartments,
}) => {
  return (
    <div className="mb-4 absolute bottom-5 left-9 bg-white  dark:bg-neutral-950 w-[80%] p-2 border dark:border-black rounded-lg">
      <div className="w-full flex justify-center gap-2">
        <Button
          severity="info"
          type="button"
          className="mb-2"
          onClick={() => {
            if (selectedDepartments.length === 0)
              setSelectedDepartments([
                ...departments.map((dept) => String(dept.deptId)),
              ]);
          }}
        >
          Select all
        </Button>
        <Button
          severity="info"
          type="button"
          className="mb-2"
          onClick={() => {
            if (selectedDepartments.length > 0) setSelectedDepartments([]);
          }}
        >
          Remove all
        </Button>
      </div>
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
