"use client";

import AuthListener from "@/app/components/AuthListener";
import useDepartments from "@/app/custom-hooks/departments";
import { checkDept, decodeUserData } from "@/app/functions/functions";
import { API_URI } from "@/app/http-common/apiUrl";
import { Department, EmployeeLevel, User } from "@/app/types/types";
import {
  deleteUserById,
  findUserById,
  updateUserById,
} from "@/app/utils/service/userService";
import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import Image from "next/image";
import { InputText } from "primereact/inputtext";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { PrimeIcons } from "primereact/api";
import Link from "next/link";

const UserPage = () => {
  const params = useParams();
  const router = useRouter();

  const { setValue, handleSubmit, register, watch } = useForm<User>({
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
  const [employeeLevel, setEmployeeLevel] = useState<
    EmployeeLevel | undefined
  >();

  useEffect(() => {
    if (data?.data.user) {
      setValue("firstName", data.data.user.firstName || "");
      setValue("middleName", data.data.user.middleName || "");
      setValue("lastName", data.data.user.lastName || "");
      setValue("localNumber", data.data.user.localNumber || "");
      setValue("email", data.data.user.email || "");
      setValue("deptId", data.data.user.deptId || 0);
      setValue("phone", data.data.user.phone);
      setValue("jobTitle", data.data.user.jobTitle);
      setValue("officeLocation", data.data.user.officeLocation);
      setEmployeeLevel(data.data.user.employeeLevel);
    }
  }, [data, setValue]);

  useEffect(() => {
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

    updateUserById(Number(params.userId), data, updatedBy)
      .then((res) => console.log(res))
      .catch((err) => console.error(err));
  };

  return (
    <form
      onSubmit={handleSubmit(editForm)}
      className="overflow-y-auto overflow-x-hidden h-[85vh] w-full pt-16"
    >
      <AuthListener />
      <div className="pt-20 relative">
        <div className="absolute top-0 z-50 p-2 shadow-lg bg-[#EEE] rounded-full md:left-20">
          <Image
            src={`${API_URI}/uploads/profilepic/${data?.data.user.profilePictureLocation}`}
            alt={`user-${data?.data.user.id}`}
            className={`rounded-full h-44 w-44`}
            height="1000"
            width="1000"
          />
        </div>

        <div className="px-5 py-4 h-36 md:ps-72 md:pe-28 bg-[#EEE]/60 backdrop-blur-0 w-full flex justify-between">
          <div className="flex gap-4">
            <div className="">
              <div className="flex">
                <InputText
                  disabled={!editMode}
                  className={`bg-inherit disabled:text-blue-600 font-semibold text-xl`}
                  size={watch("firstName")?.length - 5 || 1}
                  {...register("firstName", {
                    required: "Firstname is required",
                  })}
                />

                <InputText
                  disabled={!editMode}
                  className={`bg-inherit disabled:text-blue-600 font-semibold text-xl`}
                  size={watch("lastName")?.length - 5 || 1}
                  {...register("lastName", {
                    required: "Lastname is required",
                  })}
                />
              </div>
              <InputText
                {...register("jobTitle", { required: true })}
                disabled={!editMode}
                className="bg-inherit text-sm font-medium disabled:text-black"
              />
            </div>
          </div>

          {checkDept() && (
            <div className="flex gap-2">
              <Button
                type="button"
                onClick={() => {
                  setEditMode((prev) => !prev);
                }}
                className={`text-sm h-8 w-8 justify-center ${
                  editMode
                    ? "bg-blue-600 text-white"
                    : "bg-[#EEEEEE] text-blue-600"
                }`}
                icon={`${PrimeIcons.USER_EDIT}`}
              ></Button>{" "}
              <Button
                type="button"
                onClick={() => {
                  deleteUserById(data?.data.user.id)
                    .then((response) => {
                      if (response.status === 200) {
                        router.push(`/users`);
                      }
                    })
                    .catch((err) => console.error(err));
                }}
                className={`text-sm h-8 w-8 justify-center ${
                  editMode
                    ? "bg-blue-600 text-white"
                    : "bg-[#EEEEEE] text-blue-600"
                }`}
                icon={`${PrimeIcons.LOCK}`}
              ></Button>
            </div>
          )}
        </div>
      </div>
      <div className="md:ps-24 flex w-full">
        <div className="w-[30%] p-4 flex flex-col gap-3">
          <div className="flex gap-2 items-center">
            <i className={`${PrimeIcons.ENVELOPE} text-xl`}></i>
            <InputText
              disabled={!editMode}
              className="bg-inherit disabled:text-black text-sm font-medium"
              {...register("email", { required: "Email is required" })}
            />{" "}
          </div>

          <div className="flex gap-2 items-center">
            <i className={`${PrimeIcons.PHONE} text-xl`}></i>

            <InputText
              disabled={!editMode}
              className="bg-inherit disabled:text-black text-sm font-medium"
              {...register("localNumber", {
                required: "Local Number is required",
              })}
            />
          </div>
          <div className="flex gap-2 items-center">
            <i className={`${PrimeIcons.BUILDING} text-xl`}></i>

            <InputText
              value={selectedDepartment?.departmentName ?? ""}
              required
              className="bg-inherit disabled:text-black text-sm font-medium"
              disabled={!editMode}
              readOnly
            />
          </div>
          <div className="flex gap-2 items-center">
            <i className={`${PrimeIcons.PHONE} text-xl`}></i>

            <InputText
              {...register("phone", { required: true })}
              className="bg-inherit disabled:text-black text-sm font-medium"
              disabled={!editMode}
              readOnly
            />
          </div>
          <div className="flex gap-2 items-center">
            <i className={`${PrimeIcons.BUILDING} text-xl`}></i>

            <InputText
              {...register("officeLocation", { required: true })}
              disabled={!editMode}
              className="bg-inherit disabled:text-black text-sm font-medium"
            />
          </div>
          <div className="flex gap-2 items-center">
            <i className={`${PrimeIcons.CHART_BAR} text-xl`}></i>

            <InputText
              value={employeeLevel?.level || ""}
              disabled={!editMode}
              className="bg-inherit disabled:text-black text-sm font-medium"
            />
          </div>

          {editMode && (
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
          )}
          {editMode && <Button type="submit">Save</Button>}
        </div>
        <div className="w-[70%]  p-4">
          {data?.data.user.posts && data.data.user.posts.length > 0 ? (
            <div className="flex flex-col gap-2">
              <p className="text-sm font-medium">Posts</p>
              {data?.data.user.posts.map((post) => (
                <Link href={`/posts/${post.pid}`} key={post.pid}>
                  {post.title}
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-sm font-medium">No posts yet</p>
          )}
        </div>
      </div>
    </form>
  );
};

export default UserPage;
