import { Query } from "@/app/types/types";
import { fetchDepartments } from "@/app/utils/service/departmentService";
import { useQuery } from "@tanstack/react-query";
import { PrimeIcons } from "primereact/api";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { confirmDialog } from "primereact/confirmdialog";
import { DataTable } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import { OverlayPanel } from "primereact/overlaypanel";
import React, { useEffect, useRef, useState } from "react";

const Departments = () => {
  const [query, setQuery] = useState<Query>({ search: "", skip: 0, take: 100 });
  const [searchTerm, setSearchTerm] = useState<string>("");
  const overlayPanelRef = useRef<OverlayPanel>(null);
  const [selectedDeptId, setSelectedDeptId] = useState<number>();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: [`departments-${JSON.stringify(query)}`],
    queryFn: () => fetchDepartments(query),
  });

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

  const accept = () => {};

  if (isLoading) {
    return (
      <div className="p-6">
        <p>Loading the departments</p>
      </div>
    );
  }

  return (
    <div>
      <div className="h-20 bg-white border px-6 flex items-center justify-between">
        <h3 className="font-bold  text-xl">Departments</h3>
        <div className="flex items-center me-4 gap-2">
          <InputText
            placeholder="Search a department"
            className="bg-neutral-100 px-4 h-10 w-72"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
            }}
          />
          <Button
            icon={`${PrimeIcons.PLUS} text-lg text-white`}
            className="justify-center items-center flex h-9 w-9 rounded bg-blue-400"
          />
        </div>
      </div>
      <div className="w-full md:h-[86vh] overflow-auto p-6">
        <DataTable value={data?.data.departments} size="normal">
          <Column sortable field="departmentName" header="Name"></Column>
          <Column sortable field="departmentCode" header="Code"></Column>
          <Column sortable field="createdAt" header="Created"></Column>
          <Column sortable field="updatedAt" header="Updated"></Column>
          <Column
            header="Action"
            body={(rowData) => (
              <>
                <OverlayPanel ref={overlayPanelRef}>
                  <div className="flex flex-col gap-2">
                    <Button icon={`${PrimeIcons.USER_EDIT} me-2`}>Edit</Button>
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
      </div>
    </div>
  );
};

export default Departments;
