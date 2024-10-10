"use client";
import React from "react";
import ModeToggler from "@/app/components/ModeToggler";
import useDepartments from "@/app/custom-hooks/departments";
import DepartmentsCard from "../components/DepartmentsCard";

const Departments = () => {
  const departments = useDepartments();

  return (
    <div className="w-full h-screen overflow-auto">
      <div className="w-full h-20 border-b border-gray-300 dark:border-neutral-900 flex justify-between px-6 items-center">
        <div></div>
        <ModeToggler />
      </div>

      <div className="w-full p-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-1">
        {departments.map((department) => (
          <DepartmentsCard key={department.deptId} {...department} />
        ))}
      </div>
    </div>
  );
};

export default Departments;
