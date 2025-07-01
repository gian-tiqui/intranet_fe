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
          className: "bg-inherit shadow-sm",
        },
        panel: {
          className:
            "bg-white border-0 shadow-xl rounded-xl mt-2 overflow-hidden backdrop-blur-sm",
        },
        header: {
          className:
            "bg-gradient-to-r from-slate-50 to-gray-50 border-b border-slate-200 px-4 py-3",
        },
        token: {
          className:
            "bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm rounded-full px-3 py-1 shadow-sm hover:shadow-md transition-all duration-200",
        },
        filterInput: {
          className:
            "h-11 bg-white border-0 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500/20 focus:shadow-md transition-all duration-200 placeholder:text-slate-400",
        },
        filterContainer: {
          className:
            "h-11 bg-white flex px-4 items-center border-0 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 focus-within:ring-2 focus-within:ring-blue-500/20",
        },
        list: {
          className: "p-2",
        },
        item: {
          className:
            "px-4 py-3 hover:bg-slate-50 rounded-lg mx-2 transition-all duration-150 cursor-pointer border-0",
        },
        itemGroup: {
          className:
            "px-4 py-2 text-slate-500 font-medium text-sm uppercase tracking-wide",
        },
      }}
      onChange={(e) => setSelectedDepartments(e.value)}
      placeholder="Select department recipients"
      className="w-full h-12 border-0 rounded-xl bg-white shadow-sm hover:shadow-md focus-within:shadow-lg focus-within:ring-2 focus-within:ring-blue-500/20 transition-all duration-200 mb-6"
      filter
      display="chip"
    />
  );
};

export default DepartmentsList;
