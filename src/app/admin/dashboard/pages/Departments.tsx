"use client";
import useDepartments from "@/app/custom-hooks/departments";

const Departments = () => {
  const departments = useDepartments();

  return (
    <div>
      <pre>{JSON.stringify(departments, null, 2)}</pre>
    </div>
  );
};

export default Departments;
