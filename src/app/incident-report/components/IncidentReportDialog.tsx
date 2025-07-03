"use client";

import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { useForm } from "react-hook-form";
import { CreateIncidentReportDto, Department, User } from "@/app/types/types";
import { createIncidentReport } from "@/app/utils/service/incidentReportService";
import useDepartments from "@/app/custom-hooks/departments";
import { useQuery } from "@tanstack/react-query";
import { getDepartmentUsers } from "@/app/utils/service/departmentService";
import { decodeUserData } from "@/app/functions/functions";
import useReportSignalStore from "@/app/store/refetchReportSignal";

interface Props {
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
}

const IncidentReportDialog: React.FC<Props> = ({ visible, setVisible }) => {
  const { setSignal } = useReportSignalStore();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    reset,
  } = useForm<CreateIncidentReportDto>();
  const departments = useDepartments();
  const [selectedDepartment, setSelectedDepartment] = useState<
    Department | undefined
  >();
  const [selectedUser, setSelectedUser] = useState<User | undefined>(undefined);

  const { data, isLoading: isLoadingUsers } = useQuery({
    queryKey: ["department-users", selectedDepartment?.deptId],
    queryFn: () => getDepartmentUsers(selectedDepartment?.deptId),
    enabled: !!selectedDepartment && selectedDepartment !== undefined,
  });

  const onSubmit = async (data: CreateIncidentReportDto) => {
    try {
      await createIncidentReport({ ...data, statusId: 1 });
      reset();
      setVisible(false);
      setSelectedDepartment(undefined);
      setSelectedUser(undefined);
      setSignal(true);
    } catch (error) {
      console.error("Error submitting report", error);
    }
  };

  const handleClose = () => {
    setVisible(false);
    setSelectedDepartment(undefined);
    setSelectedUser(undefined);
    reset();
  };

  useEffect(() => {
    const decoded = decodeUserData();

    if (decoded) {
      setValue("reportingDepartmentId", decoded.deptId);
      setValue("reporterId", decoded.sub);
    }
  }, [setValue]);

  const customHeaderTemplate = (
    <div className="flex items-center gap-3">
      <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-lg">
        <i className="pi pi-exclamation-triangle text-white text-lg"></i>
      </div>
      <div>
        <h3 className="text-xl font-semibold text-gray-900 m-0">
          New Incident Report
        </h3>
        <p className="text-sm text-gray-500 m-0">
          Report an incident for investigation
        </p>
      </div>
    </div>
  );

  return (
    <Dialog
      header={customHeaderTemplate}
      visible={visible}
      onHide={handleClose}
      style={{ width: "42vw" }}
      breakpoints={{ "960px": "85vw", "641px": "95vw" }}
      className="modern-dialog"
      contentClassName="!p-0"
      headerClassName="!pb-4 !border-b border-gray-200"
    >
      <div className="p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Form Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Reported Department */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Reported Department *
              </label>
              <div className="relative">
                <Dropdown
                  options={departments}
                  optionLabel="departmentName"
                  onChange={(e) => {
                    setSelectedDepartment(e.value);

                    setValue("reportedDepartmentId", e.value.deptId);
                    setSelectedUser(undefined); // Reset user when department changes
                  }}
                  value={selectedDepartment}
                  placeholder="Select department"
                  className={`w-full modern-dropdown ${
                    errors.reportedDepartmentId ? "p-invalid" : ""
                  }`}
                  panelClassName="modern-dropdown-panel"
                />
                {errors.reportedDepartmentId && (
                  <small className="text-red-500 text-xs mt-1 block">
                    Department is required
                  </small>
                )}
              </div>
            </div>

            {/* Reported User */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Reported User *
              </label>
              <div className="relative">
                <Dropdown
                  options={data?.data.users}
                  optionLabel="fullName"
                  value={selectedUser}
                  onChange={(e) => {
                    setSelectedUser(e.value);
                    setValue("reportedUserId", e.value.id);
                  }}
                  placeholder="Select user"
                  disabled={!selectedDepartment || isLoadingUsers}
                  className={`w-full modern-dropdown ${
                    errors.reportedUserId ? "p-invalid" : ""
                  }`}
                  panelClassName="modern-dropdown-panel"
                />
                {isLoadingUsers && (
                  <small className="text-gray-500 text-xs mt-1 block">
                    Loading users...
                  </small>
                )}
                {errors.reportedUserId && (
                  <small className="text-red-500 text-xs mt-1 block">
                    User is required
                  </small>
                )}
              </div>
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Incident Title *
            </label>
            <InputText
              {...register("title", { required: "Title is required" })}
              placeholder="Brief description of the incident"
              className={`w-full modern-input ${
                errors.title ? "p-invalid" : ""
              }`}
            />
            {errors.title && (
              <small className="text-red-500 text-xs mt-1 block">
                {errors.title.message}
              </small>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Detailed Description *
            </label>
            <InputTextarea
              {...register("reportDescription", {
                required: "Description is required",
                minLength: {
                  value: 20,
                  message: "Description must be at least 20 characters",
                },
              })}
              placeholder="Provide detailed information about the incident, including what happened, when, and any relevant context..."
              rows={4}
              className={`w-full modern-textarea ${
                errors.reportDescription ? "p-invalid" : ""
              }`}
            />
            {errors.reportDescription && (
              <small className="text-red-500 text-xs mt-1 block">
                {errors.reportDescription.message}
              </small>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-6 border-t text-white border-gray-200">
            <Button
              label="Cancel"
              type="button"
              className="modern-button-secondary"
              onClick={handleClose}
              disabled={isSubmitting}
            />
            <Button
              label={isSubmitting ? "Submitting..." : "Submit Report"}
              icon={isSubmitting ? "pi pi-spin pi-spinner" : "pi pi-check"}
              type="submit"
              className="modern-button-primary"
              disabled={isSubmitting}
            />
          </div>
        </form>
      </div>

      <style jsx global>{`
        .modern-dialog .p-dialog {
          border-radius: 16px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          border: none;
        }

        .modern-dialog .p-dialog-header {
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
          border-radius: 16px 16px 0 0;
          padding: 1.5rem;
        }

        .modern-dialog .p-dialog-content {
          background: white;
          border-radius: 0 0 16px 16px;
        }

        .modern-input {
          border: 1.5px solid #e5e7eb;
          border-radius: 12px;
          padding: 12px 16px;
          font-size: 14px;
          transition: all 0.2s ease;
          background: white;
        }

        .modern-input:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
          outline: none;
        }

        .modern-input.p-invalid {
          border-color: #ef4444;
          box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
        }

        .modern-textarea {
          border: 1.5px solid #e5e7eb;
          border-radius: 12px;
          padding: 12px 16px;
          font-size: 14px;
          transition: all 0.2s ease;
          background: white;
          resize: vertical;
          min-height: 120px;
        }

        .modern-textarea:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
          outline: none;
        }

        .modern-textarea.p-invalid {
          border-color: #ef4444;
          box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
        }

        .modern-dropdown {
          border: 1.5px solid #e5e7eb;
          border-radius: 12px;
          background: white;
          transition: all 0.2s ease;
        }

        .modern-dropdown:not(.p-disabled):hover {
          border-color: #9ca3af;
        }

        .modern-dropdown.p-focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .modern-dropdown.p-invalid {
          border-color: #ef4444;
          box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
        }

        .modern-dropdown .p-dropdown-label {
          padding: 12px 16px;
          font-size: 14px;
        }

        .modern-dropdown .p-dropdown-trigger {
          padding: 12px 16px;
        }

        .modern-dropdown-panel {
          border-radius: 12px;
          border: 1.5px solid #e5e7eb;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
          margin-top: 4px;
        }

        .modern-dropdown-panel .p-dropdown-item {
          padding: 10px 16px;
          font-size: 14px;
          transition: all 0.15s ease;
        }

        .modern-dropdown-panel .p-dropdown-item:hover {
          background: #f3f4f6;
        }

        .modern-dropdown-panel .p-dropdown-item.p-highlight {
          background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
          color: white;
        }

        .modern-button-primary {
          background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
          border: none;
          border-radius: 10px;
          padding: 12px 24px;
          font-weight: 500;
          font-size: 14px;
          transition: all 0.2s ease;
          box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.2);
        }

        .modern-button-primary:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 6px 8px -1px rgba(59, 130, 246, 0.3);
        }

        .modern-button-primary:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .modern-button-secondary {
          background: white;
          border: 1.5px solid #e5e7eb;
          border-radius: 10px;
          padding: 12px 24px;
          font-weight: 500;
          font-size: 14px;
          color: #374151;
          transition: all 0.2s ease;
        }

        .modern-button-secondary:hover:not(:disabled) {
          background: #f9fafb;
          border-color: #d1d5db;
          transform: translateY(-1px);
        }

        .modern-button-secondary:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        @media (max-width: 768px) {
          .modern-dialog .p-dialog-header {
            padding: 1rem;
          }

          .modern-dialog .p-dialog-content {
            padding: 1rem;
          }

          .grid-cols-1.md\\:grid-cols-2 {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </Dialog>
  );
};

export default IncidentReportDialog;
