"use client";
import AuthListener from "@/app/components/AuthListener";
import { Query } from "@/app/types/types";
import { findUsers } from "@/app/utils/service/userService";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { PrimeIcons } from "primereact/api";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import React, { useState } from "react";

const UsersPageClient = () => {
  const [query] = useState<Query>({ search: "" });

  const { data, isLoading, isError, error } = useQuery({
    queryKey: [`users-${JSON.stringify(query)}`],
    queryFn: () => findUsers(query),
  });

  if (isLoading) return <div className="text-sm">Loading users...</div>;

  if (isError) {
    console.error(error);

    return (
      <div className="text-sm">
        There was a problem in loading the users, try again later
      </div>
    );
  }

  return (
    <div className="w-full h-[86vh] overflow-y-auto">
      <AuthListener />
      <DataTable value={data?.data.users} size="small" className="text-sm">
        <Column field="firstName" header="First name" />
        <Column field="middleName" header="Middle Name" />
        <Column field="lastName" header="Last Name" />
        <Column
          header="Department"
          body={(rowData) => {
            return <span>{rowData.department.departmentName}</span>;
          }}
        />
        <Column
          header="Action"
          body={(rowData) => (
            <Link href={`users/${rowData.id}`}>
              <i className={`${PrimeIcons.ARROW_RIGHT}`}></i>
            </Link>
          )}
        />
      </DataTable>
    </div>
  );
};

export default UsersPageClient;
