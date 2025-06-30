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
  uploadProfilePicture,
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
import { FileUpload } from "primereact/fileupload";

const UserPage = () => {
  const params = useParams();
  const router = useRouter();

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

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: [`user-${params.userId}`],
    queryFn: () => findUserById(Number(params.userId)),
    enabled: typeof params.userId === "string",
  });

  const [selectedDepartment, setSelectedDepartment] =
    useState<Department | null>(null);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [, setIsUploading] = useState<boolean>(false);
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-sm font-medium">
            Loading user profile...
          </p>
        </div>
      </div>
    );
  }

  if (isError) {
    console.error(error);
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="bg-[#EEEEEE] rounded-2xl shadow-xl p-8 text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i
              className={`${PrimeIcons.EXCLAMATION_TRIANGLE} text-red-600 text-2xl`}
            ></i>
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            Error Loading Profile
          </h3>
          <p className="text-gray-600 text-sm mb-6">
            There was a problem loading the user profile. Please try again
            later.
          </p>
          <Button
            onClick={() => router.back()}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold"
          >
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const editForm = (data: User) => {
    const updatedBy = decodeUserData()?.sub;

    updateUserById(Number(params.userId), data, updatedBy)
      .then((res) => {
        if (res.status === 200) {
          setEditMode(false);
        }
      })
      .catch((err) => console.error(err));
  };

  const handleUpload = (formData: FormData) => {
    setIsUploading(true);
    uploadProfilePicture(data?.data.user.id, formData)
      .then(() => {
        refetch();
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setIsUploading(false);
      });
  };

  const handleDelete = () => {
    if (
      window.confirm(
        "Are you sure you want to delete this user? This action cannot be undone."
      )
    ) {
      deleteUserById(data?.data.user.id)
        .then((response) => {
          if (response.status === 200) {
            router.push(`/users`);
          }
        })
        .catch((err) => console.error(err));
    }
  };

  return (
    <div className="min-h-screen ">
      <AuthListener />

      <form
        onSubmit={handleSubmit(editForm)}
        className="max-w-6xl mx-auto px-4 py-8"
      >
        {/* Hero Section with Profile */}
        <div className="relative mb-8">
          {/* Background Card */}
          <div className="bg-[#EEEEEE] rounded-3xl shadow-xl overflow-hidden">
            {/* Header Gradient */}
            <div className="h-48 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 relative">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="absolute top-6 right-6 flex gap-3">
                {checkDept() && (
                  <>
                    <Button
                      type="button"
                      onClick={() => setEditMode(!editMode)}
                      className={`w-12 h-12 rounded-xl shadow-lg transition-all duration-300 ${
                        editMode
                          ? "bg-[#EEEEEE] text-blue-600 shadow-xl scale-105"
                          : "bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm"
                      }`}
                      icon={`${PrimeIcons.USER_EDIT} text-lg`}
                      tooltip={editMode ? "Cancel editing" : "Edit profile"}
                    />
                    <Button
                      type="button"
                      onClick={handleDelete}
                      className="w-12 h-12 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-white backdrop-blur-sm shadow-lg transition-all duration-300"
                      icon={`${PrimeIcons.TRASH} text-lg`}
                      tooltip="Delete user"
                    />
                  </>
                )}
              </div>
            </div>

            {/* Profile Content */}
            <div className="relative px-8 pb-8">
              {/* Profile Picture */}
              <div className="absolute -top-16 left-8">
                <div className="relative">
                  <div className="w-32 h-32 rounded-2xl bg-[#EEEEEE] p-2 shadow-xl">
                    <Image
                      src={`${API_URI}/uploads/profilepic/${data?.data.user.profilePictureLocation}`}
                      alt={`${data?.data.user.firstName} ${data?.data.user.lastName}`}
                      className="w-full h-full rounded-xl object-cover"
                      height="200"
                      width="200"
                    />
                  </div>

                  {/* Upload Button */}
                  {checkDept() && (
                    <div className="absolute -bottom-2 -right-2">
                      <FileUpload
                        mode="basic"
                        name="profile"
                        accept="image/*"
                        customUpload
                        className="[&_.p-button]:w-10 [&_.p-button]:h-10 [&_.p-button]:rounded-full [&_.p-button]:bg-blue-600 [&_.p-button]:border-0 [&_.p-button]:shadow-lg"
                        uploadHandler={(event) => {
                          const file = event.files?.[0];
                          if (file) {
                            const formData = new FormData();
                            formData.append("file", file);
                            handleUpload(formData);
                          }
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Name and Title */}
              <div className="pt-20 pb-6">
                <div className="flex items-center gap-3 mb-3">
                  {editMode ? (
                    <div className="flex gap-3">
                      <InputText
                        {...register("firstName", {
                          required: "First name is required",
                        })}
                        placeholder="First name"
                        className="text-xl font-bold bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-2 focus:border-blue-500 focus:bg-[#EEEEEE] transition-all"
                      />
                      <InputText
                        {...register("lastName", {
                          required: "Last name is required",
                        })}
                        placeholder="Last name"
                        className="text-xl font-bold bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-2 focus:border-blue-500 focus:bg-[#EEEEEE] transition-all"
                      />
                    </div>
                  ) : (
                    <h1 className="text-2xl font-bold text-gray-900">
                      {data?.data.user.firstName} {data?.data.user.lastName}
                    </h1>
                  )}
                </div>

                {editMode ? (
                  <InputText
                    {...register("jobTitle", { required: true })}
                    placeholder="Job title"
                    className="text-base text-gray-600 bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-2 focus:border-blue-500 focus:bg-[#EEEEEE] transition-all"
                  />
                ) : (
                  <p className="text-base text-gray-600 font-medium">
                    {data?.data.user.jobTitle}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information Grid */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Contact Details Card */}
          <div className="bg-[#EEEEEE] rounded-2xl shadow-lg p-8">
            <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <i className={`${PrimeIcons.USER} text-blue-600`}></i>
              </div>
              Contact Information
            </h2>

            <div className="space-y-6">
              {/* Email */}
              <div className="group">
                <label className="block text-xs font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                    <i className={`${PrimeIcons.ENVELOPE} text-gray-400`}></i>
                  </div>
                  <InputText
                    {...register("email", { required: "Email is required" })}
                    disabled={!editMode}
                    className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 transition-all text-sm ${
                      editMode
                        ? "border-gray-200 focus:border-blue-500 bg-[#EEEEEE]"
                        : "border-gray-100 bg-gray-50 text-gray-700"
                    }`}
                    placeholder="user@example.com"
                  />
                </div>
              </div>

              {/* Local Number */}
              <div className="group">
                <label className="block text-xs font-semibold text-gray-700 mb-2">
                  Local Number
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                    <i className={`${PrimeIcons.PHONE} text-gray-400`}></i>
                  </div>
                  <InputText
                    {...register("localNumber", {
                      required: "Local number is required",
                    })}
                    disabled={!editMode}
                    className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 transition-all text-sm ${
                      editMode
                        ? "border-gray-200 focus:border-blue-500 bg-[#EEEEEE]"
                        : "border-gray-100 bg-gray-50 text-gray-700"
                    }`}
                    placeholder="1234"
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="group">
                <label className="block text-xs font-semibold text-gray-700 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                    <i className={`${PrimeIcons.MOBILE} text-gray-400`}></i>
                  </div>
                  <InputText
                    {...register("phone", { required: true })}
                    disabled={!editMode}
                    className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 transition-all text-sm ${
                      editMode
                        ? "border-gray-200 focus:border-blue-500 bg-[#EEEEEE]"
                        : "border-gray-100 bg-gray-50 text-gray-700"
                    }`}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Work Information Card */}
          <div className="bg-[#EEEEEE] rounded-2xl shadow-lg p-8">
            <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-3">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <i className={`${PrimeIcons.BUILDING} text-purple-600`}></i>
              </div>
              Work Information
            </h2>

            <div className="space-y-6">
              {/* Department */}
              <div className="group">
                <label className="block text-xs font-semibold text-gray-700 mb-2">
                  Department
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                    <i className={`${PrimeIcons.SITEMAP} text-gray-400`}></i>
                  </div>
                  {editMode ? (
                    <Dropdown
                      options={departments}
                      value={selectedDepartment}
                      optionLabel="departmentName"
                      placeholder="Select department"
                      className="w-full [&_.p-dropdown]:pl-12 [&_.p-dropdown]:py-3 [&_.p-dropdown]:rounded-xl [&_.p-dropdown]:border-2 [&_.p-dropdown]:border-gray-200 [&_.p-dropdown]:text-sm"
                      onChange={(e) => setSelectedDepartment(e.value)}
                    />
                  ) : (
                    <div className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-100 bg-gray-50 text-gray-700 text-sm">
                      {selectedDepartment?.departmentName ||
                        "No department assigned"}
                    </div>
                  )}
                </div>
              </div>

              {/* Office Location */}
              <div className="group">
                <label className="block text-xs font-semibold text-gray-700 mb-2">
                  Office Location
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                    <i className={`${PrimeIcons.MAP_MARKER} text-gray-400`}></i>
                  </div>
                  <InputText
                    {...register("officeLocation", { required: true })}
                    disabled={!editMode}
                    className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 transition-all text-sm ${
                      editMode
                        ? "border-gray-200 focus:border-blue-500 bg-[#EEEEEE]"
                        : "border-gray-100 bg-gray-50 text-gray-700"
                    }`}
                    placeholder="Building A, Floor 2, Room 201"
                  />
                </div>
              </div>

              {/* Employee Level */}
              <div className="group">
                <label className="block text-xs font-semibold text-gray-700 mb-2">
                  Employee Level
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                    <i className={`${PrimeIcons.CHART_BAR} text-gray-400`}></i>
                  </div>
                  <div className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-100 bg-gray-50 text-gray-700 text-sm">
                    {employeeLevel?.level || "Level not set"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {editMode && (
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              onClick={() => setEditMode(false)}
              className="px-8 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-sm font-semibold transition-all"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl text-sm font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              Save Changes
            </Button>
          </div>
        )}
      </form>
    </div>
  );
};

export default UserPage;
