import { DepartmentMonitoring } from "@/app/types/types";
import React from "react";
import UserCard from "./UserCard";

interface Props {
  department?: DepartmentMonitoring;
}

const DepartmentUsers: React.FC<Props> = ({ department }) => {
  return (
    <div>
      <div className="w-full flex mb-3 ">
        <input
          placeholder="Search"
          className="rounded-lg h-8 px-5 outline-none border border-gray-300 dark:border-neutral-950 dark:bg-neutral-900"
        />
      </div>
      <section className="grid grid-cols-1 gap-4 bg-white dark:bg-neutral-900 h-96 py-3 px-2 rounded-lg overflow-auto">
        {department?.users.map((user) => (
          <UserCard key={user.userId} user={user} />
        ))}
      </section>
    </div>
  );
};

export default DepartmentUsers;
