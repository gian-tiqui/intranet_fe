import { Department, Query } from "@/app/types/types";
import { fetchDepartments } from "@/app/utils/service/departmentService";
import { useQuery } from "@tanstack/react-query";
import { InputText } from "primereact/inputtext";
import React, { useEffect, useState } from "react";

const Departments = () => {
  const [query, setQuery] = useState<Query>({ search: "", skip: 0, take: 100 });
  const [searchTerm, setSearchTerm] = useState<string>("");

  const { data } = useQuery({
    queryKey: [`departments-${JSON.stringify(query)}`],
    queryFn: () => fetchDepartments(query),
  });

  useEffect(() => {
    const interval = setTimeout(() => {
      setQuery((prev) => ({
        search: searchTerm,
        skip: prev.skip,
        take: prev.take,
      }));
    }, 700);

    return () => clearTimeout(interval);
  }, [searchTerm]);

  return (
    <div>
      <div className="h-20 bg-white border px-6 flex items-center justify-between">
        <h3 className="font-bold ms-4 text-xl">Departments</h3>
        <InputText
          placeholder="Search a department"
          className="bg-neutral-100 px-4 h-10 w-72"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
          }}
        />
      </div>
      <div className="w-full md:h-[86vh] overflow-auto p-6">
        {data?.data.departments.map((department: Department) => (
          <p key={department.deptId}>{department.departmentName}</p>
        ))}
      </div>
    </div>
  );
};

export default Departments;
