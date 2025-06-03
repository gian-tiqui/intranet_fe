"use client";
import AuthListener from "@/app/components/AuthListener";
import { Query } from "@/app/types/types";
import { findUsers } from "@/app/utils/service/userService";
import { useQuery } from "@tanstack/react-query";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import React, { useState } from "react";

const UsersPageClient = () => {
  const [query] = useState<Query>({ search: "" });

  const { data } = useQuery({
    queryKey: [`users-${JSON.stringify(query)}`],
    queryFn: () => findUsers(query),
  });

  return (
    <div className="w-full h-[86vh] overflow-y-auto">
      <AuthListener />
      <DataTable value={data?.data.users} size="small" className="text-sm">
        <Column field="firstName" header="First name" />
        <Column field="middleName" header="Middle Name" />
        <Column field="lastName" header="Last Name" />
        <Column />
      </DataTable>
    </div>
  );
};

export default UsersPageClient;
