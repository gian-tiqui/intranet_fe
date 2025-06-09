"use client";
import AuthListener from "@/app/components/AuthListener";
import { Query } from "@/app/types/types";
import { findUsers } from "@/app/utils/service/userService";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { PrimeIcons } from "primereact/api";
import { Column } from "primereact/column";
import { DataTable, DataTableFilterMeta } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import { FilterMatchMode } from "primereact/api";
import React, { useState, useEffect } from "react";
import { Button } from "primereact/button";

const UsersPageClient = () => {
  const [query] = useState<Query>({ search: "" });
  const [globalFilterValue, setGlobalFilterValue] = useState<string>("");
  const [filters, setFilters] = useState<DataTableFilterMeta>({});

  const { data, isLoading, isError, error } = useQuery({
    queryKey: [`users-${JSON.stringify(query)}`],
    queryFn: () => findUsers(query),
  });

  useEffect(() => {
    initFilters();
  }, []);

  const initFilters = () => {
    setFilters({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      firstName: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
      middleName: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
      lastName: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
      "department.departmentName": {
        value: null,
        matchMode: FilterMatchMode.CONTAINS,
      },
    });
    setGlobalFilterValue("");
  };

  const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    setFilters((prev) => ({
      ...prev,
      global: { value: value, matchMode: FilterMatchMode.CONTAINS },
    }));
    setGlobalFilterValue(value);
  };

  const clearFilter = () => {
    initFilters();
  };

  const renderHeader = () => {
    return (
      <div className="flex justify-between items-center bg-[#eee] h-14 rounded-t px-2">
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold text-blue-600">Users</span>
          <span className="text-sm text-gray-500">
            ({data?.data.users?.length || 0} users)
          </span>
        </div>
        <div className="flex items-center gap-2">
          <InputText
            value={globalFilterValue}
            onChange={onGlobalFilterChange}
            placeholder="Search users..."
            className="text-sm h-8 px-4"
          />
          <Button
            type="button"
            onClick={clearFilter}
            className="p-button p-button-outlined p-button-sm text-xs px-3 h-8 border rounded hover:bg-gray-50"
          >
            Clear
          </Button>
        </div>
      </div>
    );
  };

  const header = renderHeader();

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
    <div className="w-full h-[86vh] overflow-y-auto p-8">
      <AuthListener />

      {header}

      <DataTable
        value={data?.data.users}
        size="small"
        className="text-sm"
        paginator
        rows={5}
        rowsPerPageOptions={[5, 10, 25, 50]}
        filters={filters}
        filterDisplay="row"
        globalFilterFields={[
          "firstName",
          "middleName",
          "lastName",
          "department.departmentName",
        ]}
        emptyMessage="No users found."
        pt={{
          headerRow: { className: "bg-inherit" },
          header: { className: "rounded-3xl" },
        }}
      >
        <Column
          field="firstName"
          header="First Name"
          filter
          filterPlaceholder="Search by first name"
          style={{ minWidth: "12rem" }}
          pt={{ bodyCell: { className: "bg-inherit" } }}
        />
        <Column
          field="middleName"
          header="Middle Name"
          filter
          filterPlaceholder="Search by middle name"
          style={{ minWidth: "12rem" }}
        />
        <Column
          field="lastName"
          header="Last Name"
          filter
          filterPlaceholder="Search by last name"
          style={{ minWidth: "12rem" }}
        />
        <Column
          field="department.departmentName"
          header="Department"
          filter
          filterPlaceholder="Search by department"
          style={{ minWidth: "14rem" }}
          body={(rowData) => {
            return <span>{rowData.department?.departmentName || "N/A"}</span>;
          }}
        />
        <Column
          header="Action"
          style={{ minWidth: "8rem" }}
          body={(rowData) => (
            <Link
              href={`users/${rowData.id}`}
              className="inline-flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 transition-colors"
              title="View user details"
            >
              <i className={`${PrimeIcons.ARROW_RIGHT} text-blue-600`}></i>
            </Link>
          )}
        />
      </DataTable>
    </div>
  );
};

export default UsersPageClient;
