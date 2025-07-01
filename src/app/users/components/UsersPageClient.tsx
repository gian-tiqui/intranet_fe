"use client";
import AuthListener from "@/app/components/AuthListener";
import { Query, User } from "@/app/types/types";
import { findUsers } from "@/app/utils/service/userService";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Column } from "primereact/column";
import { DataTable, DataTableFilterMeta } from "primereact/datatable";
import { FilterMatchMode } from "primereact/api";
import React, { useState, useEffect } from "react";
import NewUserDialog from "./NewUserDialog";

const UsersPageClient = () => {
  const [query] = useState<Query>({ search: "" });
  const [, setGlobalFilterValue] = useState<string>("");
  const [filters, setFilters] = useState<DataTableFilterMeta>({});
  const [newUserDialogVisible, setNewUserDialogVisible] =
    useState<boolean>(false);

  const { data, refetch } = useQuery({
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

  return (
    <div className="w-full first-letter:overflow-hidden">
      <AuthListener />
      <NewUserDialog
        refetch={refetch}
        visible={newUserDialogVisible}
        setVisible={setNewUserDialogVisible}
      />

      {/* Main Content Area */}
      <div className="p-6 h-[calc(100%-80px)] overflow-y-auto">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          {/* Table Header with Stats */}
          <div className="p-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold mb-1">User Management</h2>
                <p className="text-blue-100 text-sm">
                  Manage and view all system users
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {data?.data?.users?.length || 0}
                  </div>
                  <div className="text-xs text-blue-100">Total Users</div>
                </div>
                <div className="w-px h-12 bg-blue-400"></div>
                <button
                  onClick={() => setNewUserDialogVisible(true)}
                  className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-all backdrop-blur-sm"
                >
                  <i className="pi pi-plus text-sm"></i>
                  <span className="text-sm font-medium">Add User</span>
                </button>
              </div>
            </div>
          </div>

          {/* Enhanced DataTable */}
          <div className="p-6">
            <DataTable
              value={data?.data.users}
              className="modern-datatable"
              paginator
              rows={10}
              rowsPerPageOptions={[10, 25, 50, 100]}
              filters={filters}
              filterDisplay="row"
              globalFilterFields={[
                "firstName",
                "middleName",
                "lastName",
                "department.departmentName",
              ]}
              rowClassName={() =>
                "hover:bg-blue-50 transition-colors border-b border-gray-100"
              }
              emptyMessage={
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <i className="pi pi-users text-2xl text-gray-400"></i>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No users found
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Get started by adding your first user to the system.
                  </p>
                  <button
                    onClick={() => setNewUserDialogVisible(true)}
                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    <i className="pi pi-plus text-sm"></i>
                    Add First User
                  </button>
                </div>
              }
              pt={{
                table: { className: "border-separate border-spacing-0 w-full" },
                thead: { className: "bg-gray-50" },
                headerRow: {
                  className:
                    "bg-gray-50 border-b border-gray-200 px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider",
                },
                bodyRow: {
                  className:
                    "px-6 py-4 whitespace-nowrap text-sm text-gray-900",
                },
              }}
            >
              <Column
                field="firstName"
                header="First Name"
                filter
                filterPlaceholder="Search first name..."
                style={{ minWidth: "12rem" }}
                body={(rowData) => (
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                      {rowData.firstName?.charAt(0)?.toUpperCase()}
                    </div>
                    <span className="font-medium text-gray-900">
                      {rowData.firstName}
                    </span>
                  </div>
                )}
              />

              <Column
                field="middleName"
                header="Middle Name"
                filter
                filterPlaceholder="Search middle name..."
                style={{ minWidth: "12rem" }}
                body={(rowData) => (
                  <span className="text-gray-600">
                    {rowData.middleName || (
                      <span className="italic text-gray-400">—</span>
                    )}
                  </span>
                )}
              />

              <Column
                field="lastName"
                header="Last Name"
                filter
                filterPlaceholder="Search last name..."
                style={{ minWidth: "12rem" }}
                body={(rowData) => (
                  <span className="font-medium text-gray-900">
                    {rowData.lastName}
                  </span>
                )}
              />

              <Column
                field="department.departmentName"
                header="Department"
                filter
                filterPlaceholder="Search department..."
                style={{ minWidth: "14rem" }}
                body={(rowData) => (
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-700">
                      {rowData.department?.departmentName || (
                        <span className="italic text-gray-400">
                          No department
                        </span>
                      )}
                    </span>
                  </div>
                )}
              />

              <Column
                header="Actions"
                style={{ minWidth: "8rem" }}
                body={(rowData) => (
                  <div className="flex items-center gap-2">
                    <Link
                      href={`users/${rowData.id}`}
                      className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 hover:text-blue-700 transition-all duration-200 group"
                      title="View user details"
                    >
                      <i className="pi pi-eye text-sm group-hover:scale-110 transition-transform"></i>
                    </Link>
                  </div>
                )}
              />
            </DataTable>
          </div>
        </div>

        {/* Footer Stats */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <i className="pi pi-users text-blue-600"></i>
              </div>
              <div>
                <p className="text-sm text-gray-600">Active Users</p>
                <p className="text-lg font-semibold text-gray-900">
                  {data?.data?.users?.length || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <i className="pi pi-building text-green-600"></i>
              </div>
              <div>
                <p className="text-sm text-gray-600">Departments</p>
                <p className="text-lg font-semibold text-gray-900">
                  {[
                    ...new Set(
                      data?.data?.users
                        ?.map((u: User) => u.department?.departmentName)
                        .filter(Boolean)
                    ),
                  ].length || 0}
                </p>
              </div>
            </div>
          </div>
          {/* 
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <i className="pi pi-chart-line text-purple-600"></i>
              </div>
              <div>
                <p className="text-sm text-gray-600">Growth</p>
                <p className="text-lg font-semibold text-gray-900">+12%</p>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default UsersPageClient;
