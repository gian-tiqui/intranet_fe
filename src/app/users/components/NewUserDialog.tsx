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
        header="New User"
        visible={visible}
        onHide={() => {
          reset();
          setVisible(false);
        }}
        pt={{
          header: { className: "bg-[#EEE] rounded-t-3xl" },
          content: { className: "bg-[#EEE]" },
          root: { className: "rounded-3xl" },
          mask: { className: "backdrop-blur" },
        }}
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-3 min-w-[350px]"
        >
          <label className="text-sm font-medium">Email</label>
          <InputText
            {...register("email", { required: true })}
            placeholder="e.g. johndoe@email.com"
            className="h-12 w-full px-5 text-sm bg-white border border-black mb-1"
          />
          {showError("email", "Email")}

          <label className="text-sm font-medium">First Name</label>
          <InputText
            {...register("firstName", { required: true })}
            placeholder="e.g. John"
            className="h-12 w-full px-5 text-sm bg-white border border-black mb-1"
          />
          {showError("firstName", "First Name")}

          <label className="text-sm font-medium">Middle Name</label>
          <InputText
            {...register("middleName")}
            placeholder="e.g. Michael"
            className="h-12 w-full px-5 text-sm bg-white border border-black mb-1"
          />

          <label className="text-sm font-medium">Last Name</label>
          <InputText
            {...register("lastName", { required: true })}
            placeholder="e.g. Doe"
            className="h-12 w-full px-5 text-sm bg-white border border-black mb-1"
          />
          {showError("lastName", "Last Name")}

          <label className="text-sm font-medium">Address</label>
          <InputText
            {...register("address", { required: true })}
            placeholder="e.g. 123 Street Name"
            className="h-12 w-full px-5 text-sm bg-white border border-black mb-1"
          />
          {showError("address", "Address")}

          <label className="text-sm font-medium">City</label>
          <InputText
            {...register("city", { required: true })}
            placeholder="e.g. Los Angeles"
            className="h-12 w-full px-5 text-sm bg-white border border-black mb-1"
          />
          {showError("city", "City")}

          <label className="text-sm font-medium">State</label>
          <InputText
            {...register("state", { required: true })}
            placeholder="e.g. California"
            className="h-12 w-full px-5 text-sm bg-white border border-black mb-1"
          />
          {showError("state", "State")}

          <label className="text-sm font-medium">Zip Code</label>
          <InputText
            {...register("zipCode", { required: true })}
            placeholder="e.g. 90001"
            className="h-12 w-full px-5 text-sm bg-white border border-black mb-1"
          />

          {showError("zipCode", "Zip Code")}

          <label className="text-sm font-medium">Date of Birth</label>
          <Controller
            name="dob"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <Calendar
                {...field}
                placeholder="e.g. 1990-01-01"
                dateFormat="yy-mm-dd"
                showIcon
                value={field.value}
                className="h-12 w-full px-5 text-sm bg-white border border-black mb-1"
                onChange={(e) => field.onChange(e.value)}
              />
            )}
          />

          <label className="text-sm font-medium">Gender</label>
          <Controller
            name="gender"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <Dropdown
                {...field}
                value={field.value}
                options={["Male", "Female", "Other"]}
                placeholder="Select gender"
                className="h-12 w-full px-5 text-sm bg-white border border-black mb-1"
                onChange={(e) => field.onChange(e.value)}
              />
            )}
          />
          {showError("gender", "Gender")}

          <label className="text-sm font-medium">Employee Level</label>
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
                placeholder="Select level"
                className="h-12 w-full px-5 text-sm bg-white border border-black mb-1"
                onChange={(e) => {
                  setSelLvl(e.value);
                  field.onChange(e.value.lid);
                }}
              />
            )}
          />
          {showError("lid", "Employee Level")}

          <label className="text-sm font-medium">Division</label>
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
                className="h-12 w-full px-5 text-sm bg-white border border-black mb-1"
                onChange={(e) => {
                  setSelDiv(e.value);
                  field.onChange(e.value.id);
                }}
              />
            )}
          />
          {showError("divisionId", "Division")}

          <label className="text-sm font-medium">Department</label>

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
                className="h-12 w-full px-5 text-sm bg-white border border-black mb-1"
                onChange={(e) => {
                  setSelDept(e.value);
                  field.onChange(e.value.deptId);
                }}
              />
            )}
          />
          {showError("deptId", "Department")}

          <label className="text-sm font-medium">Phone</label>
          <InputText
            {...register("phone", { required: true })}
            placeholder="e.g. 09123456789"
            className="h-12 w-full px-5 text-sm bg-white border border-black mb-1"
          />
          {showError("phone", "Phone")}

          <label className="text-sm font-medium">Employee ID</label>
          <InputText
            {...register("employeeId", { required: true })}
            placeholder="e.g. EMP-00123"
            className="h-12 w-full px-5 text-sm bg-white border border-black mb-1"
          />
          {showError("employeeId", "Employee ID")}

          <label className="text-sm font-medium">Job Title</label>
          <InputText
            {...register("jobTitle", { required: true })}
            placeholder="e.g. Software Engineer"
            className="h-12 w-full px-5 text-sm bg-white border border-black mb-1"
          />
          {showError("jobTitle", "Job Title")}

          <label className="text-sm font-medium">Local Number</label>
          <InputText
            {...register("localNumber", { required: true })}
            placeholder="e.g. 101"
            className="h-12 w-full px-5 text-sm bg-white border border-black mb-1"
          />
          {showError("localNumber", "Local Number")}

          <label className="text-sm font-medium">Office Location</label>
          <InputText
            {...register("officeLocation", { required: true })}
            placeholder="e.g. RD - ICT Office"
            className="h-12 w-full px-5 text-sm bg-white border border-black mb-1"
          />
          {showError("localNumber", "Local Number")}

          <Button
            icon={PrimeIcons.PLUS}
            label="Create User"
            type="submit"
            className="mt-3 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          />
        </form>
      </Dialog>
    </>
  );
};

export default NewUserDialog;
