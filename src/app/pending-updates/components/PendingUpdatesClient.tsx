"use client";
import { Query, User } from "@/app/types/types";
import {
  getAllUserUpdates,
  approveUserUpdate,
  rejectUserUpdate,
} from "@/app/utils/service/userUpdatesService";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Column } from "primereact/column";
import { DataTable, DataTableFilterMeta } from "primereact/datatable";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Badge } from "primereact/badge";
import { confirmDialog } from "primereact/confirmdialog";
import React, { useState, useEffect, useRef } from "react";
import formatDate from "@/app/utils/functions/formatDate";
import { FilterMatchMode } from "primereact/api";

// Define UserUpdates type based on your Prisma model
interface UserUpdates {
  id: number;
  userId: number;
  user: User;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  suffix?: string;
  gender?: string;
  localNumber?: string;
  address?: string;
  jobTitle?: string;
  officeLocation?: string;
  createdAt: string;
  updatedAt: string;
}

const PendingUpdatesClient = () => {
  const [query] = useState<Query>({ skip: 0, take: 10 });
  const [globalFilterValue, setGlobalFilterValue] = useState<string>("");
  const [filters, setFilters] = useState<DataTableFilterMeta>({});
  const toast = useRef<Toast>(null);
  const queryClient = useQueryClient();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["user-updates", JSON.stringify(query)],
    queryFn: () => getAllUserUpdates(query),
  });

  const approveMutation = useMutation({
    mutationFn: approveUserUpdate,
    onSuccess: () => {
      toast.current?.show({
        severity: "success",
        summary: "Success",
        detail: "User update approved successfully",
        life: 3000,
      });
      refetch();
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error: { response: { data: { message: string } } }) => {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: error?.response?.data?.message || "Failed to approve update",
        life: 3000,
      });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: rejectUserUpdate,
    onSuccess: () => {
      toast.current?.show({
        severity: "success",
        summary: "Success",
        detail: "User update rejected successfully",
        life: 3000,
      });
      refetch();
    },
    onError: (error: { response: { data: { message: string } } }) => {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: error?.response?.data?.message || "Failed to reject update",
        life: 3000,
      });
    },
  });

  useEffect(() => {
    initFilters();
  }, []);

  const initFilters = () => {
    setFilters({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      "user.firstName": { value: null, matchMode: FilterMatchMode.STARTS_WITH },
      "user.lastName": { value: null, matchMode: FilterMatchMode.STARTS_WITH },
      firstName: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
      lastName: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
      jobTitle: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });
    setGlobalFilterValue("");
  };

  const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const _filters = { ...filters };

    _filters["global"] = {
      value: value,
      matchMode: FilterMatchMode.CONTAINS,
    };

    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const confirmApproval = (updateId: number) => {
    confirmDialog({
      message: "Are you sure you want to approve this user update?",
      header: "Confirm Approval",
      icon: "pi pi-exclamation-triangle",
      acceptClassName: "p-button-success",
      accept: () => approveMutation.mutate(updateId),
    });
  };

  const confirmRejection = (updateId: number) => {
    confirmDialog({
      message:
        "Are you sure you want to reject this user update? This action cannot be undone.",
      header: "Confirm Rejection",
      icon: "pi pi-exclamation-triangle",
      acceptClassName: "p-button-danger",
      accept: () => rejectMutation.mutate(updateId),
    });
  };

  const renderHeader = () => {
    return (
      <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <input
            type="text"
            value={globalFilterValue}
            onChange={onGlobalFilterChange}
            placeholder="Search updates..."
            className="p-inputtext p-component"
          />
        </span>
      </div>
    );
  };

  const statusBodyTemplate = () => {
    // Since there's no status field in your model, all updates are pending
    return <Badge value="PENDING" severity="warning" className="text-sm" />;
  };

  const userBodyTemplate = (rowData: UserUpdates) => {
    return (
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
          {rowData.user?.firstName?.charAt(0)?.toUpperCase()}
        </div>
        <div>
          <div className="font-medium text-gray-900">
            {rowData.user?.firstName} {rowData.user?.lastName}
          </div>
          <div className="text-sm text-gray-500">
            {rowData.user?.department?.departmentName || "No department"}
          </div>
        </div>
      </div>
    );
  };

  // const updatedFieldsBodyTemplate = (rowData: UserUpdates) => {
  //   const updatedFields = [];

  //   if (rowData.firstName && rowData.firstName !== rowData.user.firstName) {
  //     updatedFields.push(`First Name: ${rowData.firstName}`);
  //   }
  //   if (rowData.middleName && rowData.middleName !== rowData.user.middleName) {
  //     updatedFields.push(`Middle Name: ${rowData.middleName}`);
  //   }
  //   if (rowData.lastName && rowData.lastName !== rowData.user.lastName) {
  //     updatedFields.push(`Last Name: ${rowData.lastName}`);
  //   }
  //   if (rowData.suffix && rowData.suffix !== rowData.user.suffix) {
  //     updatedFields.push(`Suffix: ${rowData.suffix}`);
  //   }
  //   if (rowData.gender && rowData.gender !== rowData.user.gender) {
  //     updatedFields.push(`Gender: ${rowData.gender}`);
  //   }
  //   if (
  //     rowData.localNumber &&
  //     rowData.localNumber !== rowData.user.localNumber
  //   ) {
  //     updatedFields.push(`Local Number: ${rowData.localNumber}`);
  //   }
  //   if (rowData.address && rowData.address !== rowData.user.address) {
  //     updatedFields.push(`Address: ${rowData.address}`);
  //   }
  //   if (rowData.jobTitle && rowData.jobTitle !== rowData.user.jobTitle) {
  //     updatedFields.push(`Job Title: ${rowData.jobTitle}`);
  //   }
  //   if (
  //     rowData.officeLocation &&
  //     rowData.officeLocation !== rowData.user.officeLocation
  //   ) {
  //     updatedFields.push(`Office Location: ${rowData.officeLocation}`);
  //   }

  //   if (updatedFields.length === 0) {
  //     return <span className="italic text-gray-400">No changes detected</span>;
  //   }

  //   return (
  //     <div className="max-w-xs">
  //       {updatedFields.map((field, index) => (
  //         <div key={index} className="text-sm mb-1">
  //           <span className="text-gray-600">{field}</span>
  //         </div>
  //       ))}
  //     </div>
  //   );
  // };

  const requestedChangesBodyTemplate = (rowData: UserUpdates) => {
    return (
      <div className="max-w-xs space-y-1">
        {rowData.firstName && (
          <div className="text-sm">
            <span className="font-medium text-gray-700">First Name:</span>
            <span className="ml-2 text-blue-600">{rowData.firstName}</span>
          </div>
        )}
        {rowData.middleName && (
          <div className="text-sm">
            <span className="font-medium text-gray-700">Middle Name:</span>
            <span className="ml-2 text-blue-600">{rowData.middleName}</span>
          </div>
        )}
        {rowData.lastName && (
          <div className="text-sm">
            <span className="font-medium text-gray-700">Last Name:</span>
            <span className="ml-2 text-blue-600">{rowData.lastName}</span>
          </div>
        )}
        {rowData.suffix && (
          <div className="text-sm">
            <span className="font-medium text-gray-700">Suffix:</span>
            <span className="ml-2 text-blue-600">{rowData.suffix}</span>
          </div>
        )}
        {rowData.gender && (
          <div className="text-sm">
            <span className="font-medium text-gray-700">Gender:</span>
            <span className="ml-2 text-blue-600">{rowData.gender}</span>
          </div>
        )}
        {rowData.localNumber && (
          <div className="text-sm">
            <span className="font-medium text-gray-700">Local Number:</span>
            <span className="ml-2 text-blue-600">{rowData.localNumber}</span>
          </div>
        )}
        {rowData.address && (
          <div className="text-sm">
            <span className="font-medium text-gray-700">Address:</span>
            <span className="ml-2 text-blue-600">{rowData.address}</span>
          </div>
        )}
        {rowData.jobTitle && (
          <div className="text-sm">
            <span className="font-medium text-gray-700">Job Title:</span>
            <span className="ml-2 text-blue-600">{rowData.jobTitle}</span>
          </div>
        )}
        {rowData.officeLocation && (
          <div className="text-sm">
            <span className="font-medium text-gray-700">Office Location:</span>
            <span className="ml-2 text-blue-600">{rowData.officeLocation}</span>
          </div>
        )}
      </div>
    );
  };

  const dateBodyTemplate = (rowData: UserUpdates) => {
    return (
      <div className="text-sm text-gray-600">
        {formatDate(rowData.createdAt)}
      </div>
    );
  };

  const actionBodyTemplate = (rowData: UserUpdates) => {
    return (
      <div className="flex items-center gap-2">
        <Button
          icon="pi pi-check"
          size="small"
          severity="success"
          outlined
          tooltip="Approve update"
          tooltipOptions={{ position: "top" }}
          onClick={() => confirmApproval(rowData.id)}
          loading={approveMutation.isPending}
          className="w-8 h-8"
        />
        <Button
          icon="pi pi-times"
          size="small"
          severity="danger"
          outlined
          tooltip="Reject update"
          tooltipOptions={{ position: "top" }}
          onClick={() => confirmRejection(rowData.id)}
          loading={rejectMutation.isPending}
          className="w-8 h-8"
        />
      </div>
    );
  };

  // Since all updates are pending in your model
  const pendingCount = data?.data?.userUpdates?.length || 0;

  return (
    <div className="w-full overflow-hidden">
      <Toast ref={toast} />

      {/* Main Content Area */}
      <div className="p-6 h-[calc(100%-80px)] overflow-y-auto">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          {/* Table Header with Stats */}
          <div className="p-6 bg-gradient-to-r from-orange-600 to-orange-700 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold mb-1">Pending Updates</h2>
                <p className="text-orange-100 text-sm">
                  Review and approve user profile updates
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">{pendingCount}</div>
                  <div className="text-xs text-orange-100">Pending Reviews</div>
                </div>
                <div className="w-px h-12 bg-orange-400"></div>
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {data?.data?.userUpdates?.length || 0}
                  </div>
                  <div className="text-xs text-orange-100">Total Updates</div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced DataTable */}
          <div className="p-6">
            <DataTable
              value={data?.data?.userUpdates}
              className="modern-datatable"
              paginator
              rows={10}
              rowsPerPageOptions={[10, 25, 50, 100]}
              filters={filters}
              filterDisplay="row"
              globalFilterFields={[
                "user.firstName",
                "user.lastName",
                "firstName",
                "lastName",
                "jobTitle",
              ]}
              header={renderHeader()}
              loading={isLoading}
              rowClassName={() =>
                "hover:bg-orange-50 transition-colors border-b border-gray-100 bg-yellow-50"
              }
              emptyMessage={
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <i className="pi pi-clock text-2xl text-gray-400"></i>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No pending updates
                  </h3>
                  <p className="text-gray-500">
                    No user profile update requests at this time.
                  </p>
                </div>
              }
              pt={{
                table: { className: "border-separate border-spacing-0 w-full" },
                thead: { className: "bg-gray-50" },
                headerRow: {
                  className: "bg-gray-50 border-b border-gray-200",
                },
              }}
            >
              <Column
                field="user"
                header="User"
                style={{ minWidth: "16rem" }}
                body={userBodyTemplate}
                sortable
              />

              <Column
                field="requestedChanges"
                header="Requested Changes"
                style={{ minWidth: "20rem" }}
                body={requestedChangesBodyTemplate}
              />

              <Column
                field="status"
                header="Status"
                style={{ minWidth: "10rem" }}
                body={statusBodyTemplate}
              />

              <Column
                field="createdAt"
                header="Request Date"
                style={{ minWidth: "12rem" }}
                body={dateBodyTemplate}
                sortable
              />

              <Column
                header="Actions"
                style={{ minWidth: "10rem" }}
                body={actionBodyTemplate}
              />
            </DataTable>
          </div>
        </div>

        {/* Footer Stats */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <i className="pi pi-clock text-yellow-600"></i>
              </div>
              <div>
                <p className="text-sm text-gray-600">Pending Requests</p>
                <p className="text-lg font-semibold text-gray-900">
                  {pendingCount}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <i className="pi pi-users text-blue-600"></i>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Requests</p>
                <p className="text-lg font-semibold text-gray-900">
                  {data?.data?.userUpdates?.length || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <i className="pi pi-calendar text-purple-600"></i>
              </div>
              <div>
                <p className="text-sm text-gray-600">This Month</p>
                <p className="text-lg font-semibold text-gray-900">
                  {data?.data?.userUpdates?.filter((update: UserUpdates) => {
                    const updateDate = new Date(update.createdAt);
                    const currentDate = new Date();
                    return (
                      updateDate.getMonth() === currentDate.getMonth() &&
                      updateDate.getFullYear() === currentDate.getFullYear()
                    );
                  }).length || 0}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PendingUpdatesClient;
