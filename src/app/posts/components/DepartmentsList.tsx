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
      value={selectedDepartments}
      options={departments.map((dept) => ({
        label: dept.departmentName,
        value: String(dept.deptId),
      }))}
      pt={{
        root: {
          className: "bg-inherit",
        },

        panel: {
          className: "bg-[#EEEEEE]",
        },
        header: { className: "bg-[#EEEEEE]" },
        token: { className: "bg-blue-600 text-white text-sm" },
        filterInput: { className: "h-10 bg-white border  border-black" },
        filterContainer: {
          className:
            "h-10 bg-white flex px-3 items-center border border-black rounded",
        },
      }}
      onChange={(e) => setSelectedDepartments(e.value)}
      placeholder="Select department recipient/s"
      className="w-full h-12 border border-black mb-6 items-center"
      filter
      display="chip"
    />
  );
};

export default DepartmentsList;
