import { Query } from "@/app/types/types";
import {
  fetchDepartments,
  removeDepartmentById,
} from "@/app/utils/service/departmentService";
import { useQuery } from "@tanstack/react-query";
import { PrimeIcons } from "primereact/api";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { confirmDialog } from "primereact/confirmdialog";
import { DataTable } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import { OverlayPanel } from "primereact/overlaypanel";
import React, { useEffect, useRef, useState } from "react";
import AddDepartmentDialog from "../components/AddDepartmentDialog";
import useSignalStore from "@/app/store/signalStore";
import { Toast } from "primereact/toast";
import EditDepartmentDialog from "../components/EditDepartmentDialog";

const Departments = () => {
  const [query, setQuery] = useState<Query>({ search: "", skip: 0, take: 100 });
  const [searchTerm, setSearchTerm] = useState<string>("");
  const overlayPanelRef = useRef<OverlayPanel>(null);
  const [selectedDeptId, setSelectedDeptId] = useState<number>();
  const [addFolderVisible, setAddFolderVisible] = useState<boolean>(false);
  const [editDepartmentVisible, setEditDepartmentVisible] =
    useState<boolean>(false);
  const { signal, setSignal } = useSignalStore();
  const toastRef = useRef<Toast>(null);
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: [`departments-${JSON.stringify(query)}`],
    queryFn: () => fetchDepartments(query),
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
        <p>There was an error in loading the departments</p>
      </div>
    );
  }

  const accept = () => {
    removeDepartmentById(selectedDeptId)
      .then((response) => {
        if (response.status === 200) {
          toastRef.current?.show({
            summary: "Success",
            detail: "The department has been removed",
          });
          refetch();
        }
      })
      .catch((error) => {
        console.error(error);
        toastRef.current?.show({
          summary: "There was a problem in removing the department",
          severity: "error",
        });
      });
  };

  return (
    <div>
      <Toast ref={toastRef} />
      <AddDepartmentDialog
        setVisible={setAddFolderVisible}
        visible={addFolderVisible}
      />
      <EditDepartmentDialog
        setVisible={setEditDepartmentVisible}
        visible={editDepartmentVisible}
        deptId={selectedDeptId}
      />
      <div className="h-20 bg-white border-b dark:bg-neutral-800 dark:border-neutral-700 px-6 flex items-center justify-between">
        <h3 className="font-bold  text-xl">Departments</h3>
        <div className="flex items-center me-4 gap-2">
          <InputText
            placeholder="Search a department"
            className="bg-neutral-100 dark:bg-neutral-700 px-4 h-10 w-72"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
            }}
          />
          <Button
            icon={`${PrimeIcons.PLUS} text-lg text-white`}
            onClick={() => {
              setAddFolderVisible(true);
            }}
            className="justify-center items-center flex h-9 w-9 rounded bg-blue-400"
          />
        </div>
      </div>
      <div className="w-full md:h-[86vh] overflow-auto p-6">
        {isLoading ? (
          <p>Loading departments...</p>
        ) : (
          <DataTable
            value={data?.data.departments}
            size="normal"
            paginator
            rows={6}
            pt={{
              paginator: {
                root: { className: "dark:bg-neutral-800 dark:text-white" },
              },
            }}
          >
            <Column
              sortable
              field="departmentName"
              header="Name"
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
              field="departmentCode"
              header="Code"
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
              field="createdAt"
              header="Created"
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
              field="updatedAt"
              header="Updated"
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
                <>
                  <OverlayPanel
                    ref={overlayPanelRef}
                    className="dark:bg-neutral-900 dark:text-white"
                  >
                    <div className="flex flex-col gap-2">
                      <Button
                        icon={`${PrimeIcons.USER_EDIT} me-2`}
                        onClick={() => {
                          setEditDepartmentVisible(true);
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        icon={`${PrimeIcons.TRASH} me-2`}
                        onClick={() =>
                          confirmDialog({
                            header: "Delete this department?",
                            accept,
                          })
                        }
                      >
                        Delete
                      </Button>
                    </div>
                  </OverlayPanel>
                  <Button
                    icon={`${PrimeIcons.COG}`}
                    className="rounded-full"
                    onClick={(e) => {
                      setSelectedDeptId(rowData.deptId);
                      overlayPanelRef.current?.toggle(e);
                    }}
                  ></Button>
                </>
              )}
            ></Column>
          </DataTable>
        )}
      </div>
    </div>
  );
};

export default Departments;
