"use client";

import React, { Dispatch, SetStateAction, useState } from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { useForm, Controller } from "react-hook-form";
import { CreateIncidentReportDto, Department, User } from "@/app/types/types";
import { createIncidentReport } from "@/app/utils/service/incidentReportService";
import useDepartments from "@/app/custom-hooks/departments";
import { useQuery } from "@tanstack/react-query";
import { getDepartmentUsers } from "@/app/utils/service/departmentService";

interface Props {
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
}

const statusOptions = [
  { label: "Pending", value: 1 },
  { label: "In Progress", value: 2 },
  { label: "Resolved", value: 3 },
];

const IncidentReportDialog: React.FC<Props> = ({ visible, setVisible }) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<CreateIncidentReportDto>();
  const departments = useDepartments();
  const [selectedDepartment, setSelectedDepartment] = useState<
    Department | undefined
  >();
  const [selectedUser, setSelectedUser] = useState<User | undefined>(undefined);

  const { data } = useQuery({
    queryKey: ["department-users"],
    queryFn: () => getDepartmentUsers(selectedDepartment?.deptId),
    enabled: !!selectedDepartment && selectedDepartment !== undefined,
  });

  const onSubmit = async (data: CreateIncidentReportDto) => {
    try {
      await createIncidentReport(data);
      reset();
      setVisible(false);
    } catch (error) {
      console.error("Error submitting report", error);
    }
  };

  return (
    <Dialog
      header="New Incident Report"
      visible={visible}
      onHide={() => setVisible(false)}
      style={{ width: "40vw" }}
      breakpoints={{ "960px": "75vw", "641px": "100vw" }}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-2">
        {/* Title */}
        <div>
          <label className="block font-medium mb-1">Title</label>
          <InputText
            {...register("title", { required: "Title is required" })}
            className={`w-full ${errors.title ? "p-invalid" : ""}`}
          />
          {errors.title && (
            <small className="text-red-500">{errors.title.message}</small>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block font-medium mb-1">Description</label>
          <InputText
            {...register("reportDescription", {
              required: "Description is required",
            })}
            className={`w-full ${errors.reportDescription ? "p-invalid" : ""}`}
          />
          {errors.reportDescription && (
            <small className="text-red-500">
              {errors.reportDescription.message}
            </small>
          )}
        </div>

        {/* Reporting Department ID */}
        <div>
          <label className="block font-medium mb-1">
            Reporting Department ID
          </label>
          <InputText
            type="number"
            {...register("reportingDepartmentId", {
              required: "Required",
              valueAsNumber: true,
            })}
            className={`w-full ${
              errors.reportingDepartmentId ? "p-invalid" : ""
            }`}
          />
          {errors.reportingDepartmentId && (
            <small className="text-red-500">
              {errors.reportingDepartmentId.message}
            </small>
          )}
        </div>

        {/* Reported Department ID */}
        <div>
          <label className="block font-medium mb-1">
            Reported Department ID
          </label>
          <Dropdown
            options={departments}
            optionLabel="departmentName"
            onChange={(e) => setSelectedDepartment(e.value)}
            value={selectedDepartment}
          />
        </div>

        {/* Reported User ID */}
        <div>
          <label className="block font-medium mb-1">Reported User ID</label>
          <Dropdown
            options={data?.data.users}
            optionLabel="fullName"
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.value)}
          />
        </div>

        {/* Status Dropdown */}
        <div>
          <label className="block font-medium mb-1">Status</label>
          <Controller
            name="statusId"
            control={control}
            rules={{ required: "Status is required" }}
            render={({ field }) => (
              <Dropdown
                options={statusOptions}
                value={field.value}
                onChange={(e) => field.onChange(e.value)}
                optionLabel="label"
                placeholder="Select status"
                className={`w-full ${errors.statusId ? "p-invalid" : ""}`}
              />
            )}
          />
          {errors.statusId && (
            <small className="text-red-500">{errors.statusId.message}</small>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end pt-4">
          <Button
            label="Cancel"
            type="button"
            className="p-button-text mr-2"
            onClick={() => setVisible(false)}
          />
          <Button label="Submit" icon="pi pi-check" type="submit" />
        </div>
      </form>
    </Dialog>
  );
};

export default IncidentReportDialog;
