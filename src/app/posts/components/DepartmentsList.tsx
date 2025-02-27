import { Department } from "@/app/types/types";
import { MultiSelect } from "primereact/multiselect";
import React, { Dispatch, SetStateAction } from "react";

interface Props {
  departments: Department[];
  selectedDepartments: string[];
  setSelectedDepartments: Dispatch<SetStateAction<string[]>>;
}

const DepartmentsList: React.FC<Props> = ({
  departments,
  selectedDepartments,
  setSelectedDepartments,
}) => {
  return (
    <MultiSelect
      pt={{}}
      value={selectedDepartments}
      options={departments.map((dept) => ({
        label: dept.departmentName,
        value: String(dept.deptId),
      }))}
      onChange={(e) => setSelectedDepartments(e.value)}
      placeholder="Select department recipient/s"
      className="w-full mb-2 h-8 items-center"
      filter
      display="chip"
    />
  );
};

export default DepartmentsList;
