"use client";

import React, { useRef, useState } from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { PrimeIcons } from "primereact/api";
import { Controller, useForm } from "react-hook-form";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { Department, Division, Level, Query, User } from "@/app/types/types";
import { fetchDepartments } from "@/app/utils/service/departmentService";
import { getDivisions } from "@/app/utils/service/divisionService";
import fetchLevels from "@/app/utils/service/levels";
import { addUserV2 } from "@/app/utils/service/userService";
import useSignalStore from "@/app/store/signalStore";

interface Props {
  visible: boolean;
  setVisible: (val: boolean) => void;
  refetch: () => Promise<UseQueryResult>;
}

const NewUserDialog: React.FC<Props> = ({ visible, setVisible, refetch }) => {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<User>();

  const toastRef = useRef<Toast>(null);
  const { setSignal } = useSignalStore();

  const [query] = useState<Query>({ search: "", skip: 0, take: 20 });
  const [selDept, setSelDept] = useState<Department>();
  const [selDiv, setSelDiv] = useState<Division>();
  const [selLvl, setSelLvl] = useState<Level>();

  const { data: deptData } = useQuery({
    queryKey: ["departments", query],
    queryFn: () => fetchDepartments(query),
  });

  const { data: divData } = useQuery({
    queryKey: ["divisions", query],
    queryFn: () => getDivisions(query),
  });

  const { data: lvlData } = useQuery({
    queryKey: ["levels"],
    queryFn: fetchLevels,
    select: (arr) =>
      arr.map((l: { level: string }) =>
        l.level === "All Employees" ? { ...l, level: "Staff" } : l
      ),
  });

  const onSubmit = (data: User) => {
    data.password = "abcd_123";
    addUserV2(data)
      .then((res) => {
        if (res.status === 201) {
          setSignal(true);
          toastRef.current?.show({ summary: "User added!", severity: "info" });
          setVisible(false);
          reset();
          refetch();
        }
      })
      .catch(() => {
        setSignal(true);
        toastRef.current?.show({
          summary: "Error adding user",
          severity: "error",
        });
      });
  };

  const showError = (field: keyof User, label: string) =>
    errors[field] ? (
      <span className="text-xs text-red-500 flex items-center gap-1">
        <i className={PrimeIcons.EXCLAMATION_TRIANGLE} />
        {label} is required
      </span>
    ) : null;

  return (
    <>
      <Toast ref={toastRef} />
      <Dialog
        header="Create New User"
        visible={visible}
        onHide={() => {
          reset();
          setVisible(false);
        }}
        pt={{
          header: {
            className:
              "bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-2xl px-6 py-4",
          },
          content: {
            className: "bg-white p-0 overflow-hidden",
          },
          root: {
            className: "rounded-2xl shadow-2xl border-0 max-w-4xl w-full",
          },
          mask: {
            className: "backdrop-blur-sm bg-black/20",
          },
        }}
        maximizable
        closable
        modal
      >
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Personal Information Section */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <i className="pi pi-user text-blue-600"></i>
                Personal Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <InputText
                    {...register("email", { required: true })}
                    placeholder="johndoe@company.com"
                    className="w-full h-12 px-4 text-sm bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                  {showError("email", "Email")}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <InputText
                    {...register("phone", { required: true })}
                    placeholder="+1 (555) 123-4567"
                    className="w-full h-12 px-4 text-sm bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                  {showError("phone", "Phone")}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <InputText
                    {...register("firstName", { required: true })}
                    placeholder="John"
                    className="w-full h-12 px-4 text-sm bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                  {showError("firstName", "First Name")}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Middle Name
                  </label>
                  <InputText
                    {...register("middleName")}
                    placeholder="Michael"
                    className="w-full h-12 px-4 text-sm bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <InputText
                    {...register("lastName", { required: true })}
                    placeholder="Doe"
                    className="w-full h-12 px-4 text-sm bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                  {showError("lastName", "Last Name")}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Date of Birth <span className="text-red-500">*</span>
                  </label>
                  <Controller
                    name="dob"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <Calendar
                        {...field}
                        placeholder="Select date"
                        dateFormat="mm/dd/yy"
                        showIcon
                        value={field.value}
                        className="w-full"
                        inputClassName="w-full h-12 px-4 text-sm bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        onChange={(e) => field.onChange(e.value)}
                      />
                    )}
                  />
                  {showError("dob", "Date of Birth")}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Gender <span className="text-red-500">*</span>
                  </label>
                  <Controller
                    name="gender"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <Dropdown
                        {...field}
                        value={field.value}
                        options={[
                          "Male",
                          "Female",
                          "Other",
                          "Prefer not to say",
                        ]}
                        placeholder="Select gender"
                        className="w-full"
                        pt={{
                          root: {
                            className:
                              "h-12 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all",
                          },
                          input: { className: "px-4 text-sm" },
                        }}
                        onChange={(e) => field.onChange(e.value)}
                      />
                    )}
                  />
                  {showError("gender", "Gender")}
                </div>
              </div>
            </div>

            {/* Address Information Section */}
            <div className="bg-green-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <i className="pi pi-map-marker text-green-600"></i>
                Address Information
              </h3>

              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Street Address <span className="text-red-500">*</span>
                  </label>
                  <InputText
                    {...register("address", { required: true })}
                    placeholder="123 Main Street, Apt 4B"
                    className="w-full h-12 px-4 text-sm bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                  />
                  {showError("address", "Address")}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      City <span className="text-red-500">*</span>
                    </label>
                    <InputText
                      {...register("city", { required: true })}
                      placeholder="Los Angeles"
                      className="w-full h-12 px-4 text-sm bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                    />
                    {showError("city", "City")}
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      State/Province <span className="text-red-500">*</span>
                    </label>
                    <InputText
                      {...register("state", { required: true })}
                      placeholder="California"
                      className="w-full h-12 px-4 text-sm bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                    />
                    {showError("state", "State")}
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      ZIP/Postal Code <span className="text-red-500">*</span>
                    </label>
                    <InputText
                      {...register("zipCode", { required: true })}
                      placeholder="90210"
                      className="w-full h-12 px-4 text-sm bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                    />
                    {showError("zipCode", "Zip Code")}
                  </div>
                </div>
              </div>
            </div>

            {/* Employment Information Section */}
            <div className="bg-purple-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <i className="pi pi-briefcase text-purple-600"></i>
                Employment Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Employee ID <span className="text-red-500">*</span>
                  </label>
                  <InputText
                    {...register("employeeId", { required: true })}
                    placeholder="EMP-001234"
                    className="w-full h-12 px-4 text-sm bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                  />
                  {showError("employeeId", "Employee ID")}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Job Title <span className="text-red-500">*</span>
                  </label>
                  <InputText
                    {...register("jobTitle", { required: true })}
                    placeholder="Software Engineer"
                    className="w-full h-12 px-4 text-sm bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                  />
                  {showError("jobTitle", "Job Title")}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Employee Level <span className="text-red-500">*</span>
                  </label>
                  <Controller
                    name="lid"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <Dropdown
                        {...field}
                        value={selLvl}
                        options={lvlData}
                        optionLabel="level"
                        placeholder="Select employee level"
                        className="w-full"
                        pt={{
                          root: {
                            className:
                              "h-12 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all",
                          },
                          input: { className: "px-4 text-sm" },
                        }}
                        onChange={(e) => {
                          setSelLvl(e.value);
                          field.onChange(e.value.lid);
                        }}
                      />
                    )}
                  />
                  {showError("lid", "Employee Level")}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Division <span className="text-red-500">*</span>
                  </label>
                  <Controller
                    name="divisionId"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <Dropdown
                        {...field}
                        value={selDiv}
                        options={divData?.data.divisions}
                        optionLabel="divisionName"
                        placeholder="Select division"
                        className="w-full"
                        pt={{
                          root: {
                            className:
                              "h-12 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all",
                          },
                          input: { className: "px-4 text-sm" },
                        }}
                        onChange={(e) => {
                          setSelDiv(e.value);
                          field.onChange(e.value.id);
                        }}
                      />
                    )}
                  />
                  {showError("divisionId", "Division")}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Department <span className="text-red-500">*</span>
                  </label>
                  <Controller
                    name="deptId"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <Dropdown
                        {...field}
                        value={selDept}
                        options={deptData?.data.departments}
                        optionLabel="departmentName"
                        placeholder="Select department"
                        className="w-full"
                        pt={{
                          root: {
                            className:
                              "h-12 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all",
                          },
                          input: { className: "px-4 text-sm" },
                        }}
                        onChange={(e) => {
                          setSelDept(e.value);
                          field.onChange(e.value.deptId);
                        }}
                      />
                    )}
                  />
                  {showError("deptId", "Department")}
                </div>
              </div>
            </div>

            {/* Office Information Section */}
            <div className="bg-orange-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <i className="pi pi-building text-orange-600"></i>
                Office Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Office Location <span className="text-red-500">*</span>
                  </label>
                  <InputText
                    {...register("officeLocation", { required: true })}
                    placeholder="RD - ICT Office, 5th Floor"
                    className="w-full h-12 px-4 text-sm bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                  />
                  {showError("officeLocation", "Office Location")}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Local Extension <span className="text-red-500">*</span>
                  </label>
                  <InputText
                    {...register("localNumber", { required: true })}
                    placeholder="101"
                    className="w-full h-12 px-4 text-sm bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                  />
                  {showError("localNumber", "Local Number")}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
              <Button
                type="button"
                label="Cancel"
                severity="secondary"
                outlined
                className="px-6 py-3 text-sm font-medium"
                onClick={() => {
                  reset();
                  setVisible(false);
                }}
              />
              <Button
                icon="pi pi-user-plus"
                label="Create User"
                type="submit"
                className="px-6 py-3 text-white text-sm font-medium bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 border-0"
              />
            </div>
          </form>
        </div>
      </Dialog>
    </>
  );
};

export default NewUserDialog;
