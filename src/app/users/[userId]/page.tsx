"use client";

import AuthListener from "@/app/components/AuthListener";
import useDepartments from "@/app/custom-hooks/departments";
import { checkDept, decodeUserData } from "@/app/functions/functions";
import { API_URI } from "@/app/http-common/apiUrl";
import { Department, User } from "@/app/types/types";
import { findUserById, updateUserById } from "@/app/utils/service/userService";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import Image from "next/image";
import { InputText } from "primereact/inputtext";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const UserPage = () => {
  const params = useParams();

  const { setValue, handleSubmit, register } = useForm<User>({
    defaultValues: {
      firstName: "",
      middleName: "",
      lastName: "",
      localNumber: "",
      email: "",
      deptId: 0,
    },
  });

  const { data, isLoading, isError, error } = useQuery({
    queryKey: [`user-${params.userId}`],
    queryFn: () => findUserById(Number(params.userId)),
    enabled: typeof params.userId === "string",
  });

  const [selectedDepartment, setSelectedDepartment] =
    useState<Department | null>(null);
  const [editMode, setEditMode] = useState<boolean>(false);
  const departments = useDepartments();

  useEffect(() => {
    if (data?.data.user) {
      console.log(data.data.user);
      setValue("firstName", data.data.user.firstName || "");
      setValue("middleName", data.data.user.middleName || "");
      setValue("lastName", data.data.user.lastName || "");
      setValue("localNumber", data.data.user.localNumber || "");
      setValue("email", data.data.user.email || "");
      setValue("deptId", data.data.user.deptId || 0);
    }
  }, [data, setValue]);

  useEffect(() => {
    // Ensure we set a value or null, never undefined
    setSelectedDepartment(data?.data.user.department || null);
  }, [data]);

  useEffect(() => {
    if (selectedDepartment) {
      setValue("deptId", selectedDepartment.deptId);
    }
  }, [selectedDepartment, setValue]);

  if (isLoading) return <div className="text-sm">Loading user...</div>;

  if (isError) {
    console.error(error);
    return (
      <div className="text-sm">
        There was a problem in loading the user. Try again later
      </div>
    );
  }

  const editForm = (data: User) => {
    const updatedBy = decodeUserData()?.sub;

    console.log("hi");

    updateUserById(Number(params.userId), data, updatedBy)
      .then((res) => console.log(res))
      .catch((err) => console.error(err));
  };

  return (
    <form
      onSubmit={handleSubmit(editForm)}
      className="overflow-y-auto overflow-x-hidden h-[85vh] w-full"
    >
      <AuthListener />
      <div className="py-10 px-5 bg-[#EEE]/60 backdrop-blur-0 w-full relative flex items-center">
        <Image
          src={`${API_URI}/uploads/profilepic/${data?.data.user.profilePictureLocation}`}
          alt={`user-${data?.data.user.id}`}
          className={`rounded-full h-36 w-36`}
          height="1000"
          width="1000"
        />
        {checkDept() && (
          <Button
            type="button"
            onClick={() => {
              setEditMode((prev) => !prev);
            }}
            className={`text-sm h-8 justify-center px-6 ${
              editMode ? "bg-blue-600 text-white" : "bg-[#EEEEEE] text-blue-600"
            }`}
          >
            Edit
          </Button>
        )}
      </div>
      <InputText
        disabled={!editMode}
        className="bg-inherit disabled:text-black"
        {...register("firstName", { required: "Firstname is required" })}
      />
      <InputText
        disabled={!editMode}
        className="bg-inherit disabled:text-black"
        {...register("middleName")}
      />
      <InputText
        disabled={!editMode}
        className="bg-inherit disabled:text-black"
        {...register("lastName", { required: "Lastname is required" })}
      />
      <InputText
        disabled={!editMode}
        className="bg-inherit disabled:text-black"
        {...register("email", { required: "Email is required" })}
      />{" "}
      patient balvedina joebert sa nung june 2 nasa ER papactive
      <InputText
        disabled={!editMode}
        className="bg-inherit disabled:text-black"
        {...register("localNumber", { required: "Local Number is required" })}
      />
      <InputText
        value={selectedDepartment?.departmentName ?? ""}
        required
        className="bg-inherit disabled:text-black"
        disabled={!editMode}
        readOnly
      />
      <Dropdown
        options={departments}
        value={selectedDepartment}
        optionLabel="departmentName"
        disabled={!editMode}
        placeholder="Select a department"
        className="bg-inherit"
        onChange={(e) => {
          setSelectedDepartment(e.value);
        }}
      />
      {editMode && <Button type="submit">Save</Button>}
    </form>
  );
};

export default UserPage;
