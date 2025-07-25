import { Department } from "@/app/types/types";
import { MultiSelect } from "primereact/multiselect";
import React, { Dispatch, SetStateAction } from "react";

interface Props {
  departments: Department[];
  selectedDepartments: string[];
  setSelectedDepartments: Dispatch<SetStateAction<string[]>>;
  label: string;
}

const CreateFolderDropdown: React.FC<Props> = ({
  departments,
  selectedDepartments,
  setSelectedDepartments,
  label,
}) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold text-gray-700">{label}</label>
      <MultiSelect
        value={selectedDepartments}
        options={departments.map((dept) => ({
          label: dept.departmentName,
          value: String(dept.deptId),
        }))}
        pt={{
          root: {
            className:
              "w-full h-12 bg-white border border-gray-300 rounded-xl shadow-sm hover:border-blue-400 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all duration-200",
          },
          labelContainer: {
            className: "px-4 py-3 flex items-center gap-2 min-h-[3rem]",
          },
          label: {
            className: "text-sm text-gray-700 font-medium",
          },
          trigger: {
            className:
              "text-gray-400 hover:text-blue-500 transition-colors duration-200",
          },
          panel: {
            className:
              "bg-white border border-gray-200 rounded-xl shadow-lg mt-2 overflow-hidden",
          },
          header: {
            className:
              "bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-3 border-b border-gray-200",
          },
          headerCheckbox: {
            box: { className: "accent-blue-600" },
          },
          filterContainer: {
            className: "px-4 py-2",
          },
          filterInput: {
            className:
              "w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200",
          },
          list: {
            className: "max-h-48 overflow-y-auto",
          },
          item: {
            className:
              "px-4 py-3 hover:bg-blue-50 transition-colors duration-150 cursor-pointer border-b border-gray-50 last:border-b-0",
          },
          itemGroup: {
            className:
              "px-4 py-2 bg-gray-100 font-semibold text-gray-700 text-sm",
          },
          token: {
            className:
              "inline-flex items-center px-3 py-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-medium rounded-full shadow-sm hover:from-blue-600 hover:to-blue-700 transition-all duration-200",
          },
          tokenLabel: {
            className: "text-white font-medium",
          },
          removeTokenIcon: {
            className:
              "ml-2 text-blue-200 hover:text-white transition-colors duration-200 cursor-pointer",
          },
          emptyMessage: {
            className: "px-4 py-8 text-center text-gray-500 text-sm",
          },
        }}
        onChange={(e) => setSelectedDepartments(e.value)}
        placeholder="Select departments..."
        filter
        display="chip"
        filterPlaceholder="Search departments..."
        emptyMessage="No departments found"
        showClear
        maxSelectedLabels={3}
        selectedItemsLabel="{0} departments selected"
        className="w-full"
      />
      {selectedDepartments.length > 0 && (
        <p className="text-xs text-gray-500 mt-1">
          {selectedDepartments.length} department
          {selectedDepartments.length !== 1 ? "s" : ""} selected
        </p>
      )}
    </div>
  );
};

export default CreateFolderDropdown;
