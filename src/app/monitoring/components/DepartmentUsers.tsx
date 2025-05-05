import { DepartmentMonitoring } from "@/app/types/types";
import React, { Dispatch, SetStateAction, useState } from "react";
import UserCard from "./UserCard";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";

interface Props {
  department?: DepartmentMonitoring;
  dept?: DepartmentMonitoring;
  setDept?: Dispatch<SetStateAction<DepartmentMonitoring | undefined>>;
  departments?: DepartmentMonitoring[];
}

const DepartmentUsers: React.FC<Props> = ({
  department,
  departments,
  setDept,
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredUsers = (department?.users ?? [])
    .filter(
      (user) =>
        user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => a.firstName.localeCompare(b.firstName));

  const groupedUsers: { [key: string]: typeof filteredUsers } = {};
  filteredUsers?.forEach((user) => {
    const firstLetter = user.firstName[0].toUpperCase();
    if (!groupedUsers[firstLetter]) {
      groupedUsers[firstLetter] = [];
    }
    groupedUsers[firstLetter].push(user);
  });

  return (
    <div>
      <h1 className="text-blue-600 text-xl font-bold mb-5">
        Users Read Monitoring
      </h1>
      <div className="w-full flex flex-col gap-2 md:gap-0 md:flex-row mb-3 justify-between">
        <InputText
          type="text"
          placeholder="Search here..."
          className="px-5 w-72 text-sm bg-[#EEEEEE] rounded-xl shadow"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <Dropdown
          options={departments}
          className="bg-[#EEEEEE] w-72 rounded-xl shadow"
          pt={{
            input: { className: "text-sm" },
            item: { className: "text-sm" },
          }}
          value={department}
          optionLabel="departmentName"
          filter
          onChange={(e) => {
            const dept = e.value;
            if (dept && setDept) setDept(e.value);
          }}
        />
      </div>

      <section className="flex flex-col gap-4 overflow-auto">
        {filteredUsers && filteredUsers.length > 0 ? (
          Object.keys(groupedUsers)
            .sort()
            .map((letter) => (
              <div key={letter}>
                <h2 className="text-xl font-bold mb-3 mt-3 text-blue-600">
                  {letter}
                </h2>
                <div className="flex flex-col bg-[#EEEEEE] py-3 rounded-xl">
                  {groupedUsers[letter].map((user, index) => (
                    <UserCard key={user.userId} user={user} index={index} />
                  ))}
                </div>
              </div>
            ))
        ) : (
          <div className="h-full w-full grid place-content-center">
            <p>Nothing to show here</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default DepartmentUsers;
