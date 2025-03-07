import { Query } from "@/app/types/types";
import { useQuery } from "@tanstack/react-query";
import { PrimeIcons } from "primereact/api";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import React, { useEffect, useRef, useState } from "react";
import useSignalStore from "@/app/store/signalStore";
import { Toast } from "primereact/toast";
import { deleteUserById, findUsers } from "@/app/utils/service/userService";
import AddUserDialog from "../components/AddUserDialog";
import DeactivateUserDialog from "../components/DeactivateUserDialog";
import UserOverlay from "../components/UserOverlay";
import EditUserDialog from "../components/EditUserDialog";

const Departments = () => {
  const [query, setQuery] = useState<Query>({ search: "", skip: 0, take: 10 });
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedUserId, setSelectedUserId] = useState<number>();
  const [addUserVisible, setAddUserVisible] = useState<boolean>(false);
  const [editUserVisible, setEditUserVisible] = useState<boolean>(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>("");
  const [deactivateUserVisible, setDeactivateUserVisible] =
    useState<boolean>(false);
  const { signal, setSignal } = useSignalStore();
  const toastRef = useRef<Toast>(null);
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: [`users-${JSON.stringify(query)}`],
    queryFn: () => findUsers(query),
  });

  useEffect(() => {
    if (signal) refetch();

    return () => setSignal(false);
  }, [signal, refetch, setSignal]);

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

  if (isError) {
    console.error(error);

    return (
      <div className="p-6">
        <p>There was an error in loading the users</p>
      </div>
    );
  }

  const accept = () => {
    deleteUserById(selectedUserId)
      .then((response) => {
        if (response.status === 200) {
          toastRef.current?.show({
            summary: "Success",
            detail: "The user has been removed",
          });
          refetch();
        }
      })
      .catch((error) => {
        console.error(error);
        toastRef.current?.show({
          summary: "There was a problem in removing the user",
          severity: "error",
        });
      });
  };

  return (
    <div>
      <Toast ref={toastRef} />
      <AddUserDialog setVisible={setAddUserVisible} visible={addUserVisible} />
      <DeactivateUserDialog
        refetch={refetch}
        visible={deactivateUserVisible}
        setVisible={setDeactivateUserVisible}
        employeeId={selectedEmployeeId}
      />
      <EditUserDialog
        refetch={refetch}
        setVisible={setEditUserVisible}
        visible={editUserVisible}
        userId={selectedUserId}
      />

      <div className="h-20 bg-white border-b dark:bg-neutral-800 dark:border-neutral-700 px-6 flex items-center justify-between">
        <h3 className="font-bold  text-xl">Users</h3>
        <div className="flex items-center me-4 gap-2">
          <InputText
            placeholder="Search a user"
            className="bg-neutral-100 dark:bg-neutral-700 px-4 h-10 w-72"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
            }}
          />
          <Button
            icon={`${PrimeIcons.PLUS} text-lg text-white`}
            onClick={() => {
              setAddUserVisible(true);
            }}
            className="justify-center items-center flex h-9 w-9 rounded bg-blue-400"
          />
        </div>
      </div>
      <div className="w-full md:h-[86vh] overflow-auto p-6">
        {isLoading ? (
          <p>Loading users...</p>
        ) : (
          <DataTable
            paginator
            rows={4}
            value={data?.data.users}
            size="normal"
            pt={{
              paginator: {
                root: { className: "dark:bg-neutral-800 dark:text-white" },
              },
            }}
          >
            <Column
              sortable
              field="employeeId"
              header="ID"
              pt={{
                headerCell: {
                  className: "dark:bg-neutral-950 dark:text-white",
                },
                bodyCell: {
                  className: "dark:bg-neutral-800 dark:text-white",
                },
              }}
            ></Column>
            <Column
              sortable
              field="firstName"
              header="First Name"
              pt={{
                headerCell: {
                  className: "dark:bg-neutral-950 dark:text-white",
                },
                bodyCell: {
                  className: "dark:bg-neutral-800 dark:text-white",
                },
              }}
            ></Column>
            <Column
              sortable
              field="lastName"
              header="Last Name"
              pt={{
                headerCell: {
                  className: "dark:bg-neutral-950 dark:text-white",
                },
                bodyCell: {
                  className: "dark:bg-neutral-800 dark:text-white",
                },
              }}
            ></Column>
            <Column
              sortable
              field="confirmed"
              header="Activated"
              pt={{
                headerCell: {
                  className: "dark:bg-neutral-950 dark:text-white",
                },
                bodyCell: {
                  className: "dark:bg-neutral-800 dark:text-white",
                },
              }}
            ></Column>
            <Column
              sortable
              header="Department"
              pt={{
                headerCell: {
                  className: "dark:bg-neutral-950 dark:text-white",
                },
                bodyCell: {
                  className: "dark:bg-neutral-800 dark:text-white",
                },
              }}
              body={(rowData) => <p>{rowData.department.departmentName}</p>}
            ></Column>
            <Column
              sortable
              header="Level"
              pt={{
                headerCell: {
                  className: "dark:bg-neutral-950 dark:text-white",
                },
                bodyCell: {
                  className: "dark:bg-neutral-800 dark:text-white",
                },
              }}
              body={(rowData) => (
                <p>
                  {rowData.employeeLevel.level === "All Employees"
                    ? "Staff"
                    : rowData.employeeLevel.level}
                </p>
              )}
            ></Column>
            <Column
              sortable
              header="Created"
              pt={{
                headerCell: {
                  className: "dark:bg-neutral-950 dark:text-white",
                },
                bodyCell: {
                  className: "dark:bg-neutral-800 dark:text-white",
                },
              }}
              body={(rowData) => (
                <p>
                  {new Date(rowData.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              )}
            ></Column>

            <Column
              pt={{
                headerCell: {
                  className: "dark:bg-neutral-950 dark:text-white",
                },
                bodyCell: {
                  className: "dark:bg-neutral-800 dark:text-white",
                },
              }}
              header="Action"
              body={(rowData) => (
                <UserOverlay
                  accept={accept}
                  setEditUserVisible={setEditUserVisible}
                  rowData={rowData}
                  setDeactivateUserVisible={setDeactivateUserVisible}
                  setSelectedEmployeeId={setSelectedEmployeeId}
                  setSelectedUserId={setSelectedUserId}
                />
              )}
            ></Column>
          </DataTable>
        )}
      </div>
    </div>
  );
};

export default Departments;
