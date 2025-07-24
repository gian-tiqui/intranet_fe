import React, { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { Icon } from "@iconify/react";
import apiClient from "../http-common/apiUrl";
import { API_BASE, INTRANET } from "../bindings/binding";
import { decodeUserData } from "../functions/functions";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { useQuery } from "@tanstack/react-query";
import { findUserById } from "../utils/service/userService";
import CustomToast from "./CustomToast";
import { Toast } from "primereact/toast";
import useRefetchUserStore from "../store/refetchUserData";

interface FormFields {
  firstName: string | undefined;
  middleName: string | undefined;
  lastName: string | undefined;
  suffix: string | undefined;
  gender: string | undefined;
  dob: Date | undefined;
  address: string | undefined;
  localNumber: string | undefined;
  jobTitle: string | undefined;
  officeLocation: string | undefined;
}

const UserInfo = () => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>();
  const toastRef = useRef<Toast>(null);
  const { refetch: refetchUser } = useRefetchUserStore();

  const genderOptions = [
    { label: "Male", value: "Male" },
    { label: "Female", value: "Female" },
    { label: "Other", value: "Other" },
    { label: "Prefer not to say", value: "Prefer not to say" },
  ];

  const suffixOptions = [
    { label: "Jr.", value: "Jr." },
    { label: "Sr.", value: "Sr." },
    { label: "II", value: "II" },
    { label: "III", value: "III" },
    { label: "IV", value: "IV" },
  ];

  const handleEditProfile = async (data: FormFields) => {
    const userId = decodeUserData()?.sub;

    try {
      const response = await apiClient.put(
        `${API_BASE}/users/${Number(userId)}`,
        { ...data },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(INTRANET)}`,
          },
        }
      );

      if (response.data.statusCode === 200) {
        toastRef.current?.show({
          severity: "success",
          summary: "Profile Updated",
          detail: "Your profile has been successfully updated.",
          life: 3000,
        });

        refetch();
        refetchUser();
      }
    } catch (error) {
      const { message } = error as { message: string };

      toastRef.current?.show({
        severity: "error",
        summary: "Update Failed",
        detail: message || "An error occurred while updating your profile.",
        life: 3000,
      });
    }
  };

  const {
    data: user,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["user-profile"],
    queryFn: () => {
      const id = decodeUserData()?.sub;

      return findUserById(id);
    },
  });

  useEffect(() => {
    const setFields = () => {
      if (user) {
        setValue("firstName", user.data.user.firstName);
        setValue("middleName", user.data.user.middleName);
        setValue("lastName", user.data.user.lastName);
        setValue("address", user.data.user.address);
        setValue("gender", user.data.user.gender);
        setValue("suffix", user.data.user.suffix);
        setValue("localNumber", user.data.user.localNumber);
        setValue("jobTitle", user.data.user.jobTitle);
        setValue("officeLocation", user.data.user.officeLocation);
      }
    };

    setFields();
  }, [user, setValue]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
          <Icon icon="mdi:loading" className="w-5 h-5 animate-spin" />
          <span className="text-sm">Loading profile...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header Section */}
      <CustomToast ref={toastRef} />
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <Icon icon="mdi:account-edit" className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Personal Information
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Update your profile details
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(handleEditProfile)} className="space-y-6">
        {/* Name Section */}
        <div className="bg-gray-50/50 dark:bg-gray-800/50 rounded-xl p-6 border border-gray-200/50 dark:border-gray-700/50">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Icon icon="mdi:account" className="w-4 h-4" />
            Full Name
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* First Name */}
            <div className="space-y-2">
              <label
                htmlFor="firstName"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                First Name *
              </label>
              <InputText
                id="firstName"
                {...register("firstName", {
                  required: "First name is required",
                })}
                pt={{
                  root: {
                    className: `w-full px-4 py-3 text-sm bg-white dark:bg-gray-900 border ${
                      errors.firstName
                        ? "border-red-300 dark:border-red-700 focus:border-red-500 dark:focus:border-red-400"
                        : "border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400"
                    } rounded-lg transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400`,
                  },
                }}
                placeholder="Enter first name"
              />
              {errors.firstName && (
                <p className="text-xs text-red-500 dark:text-red-400 flex items-center gap-1">
                  <Icon icon="mdi:alert-circle" className="w-3 h-3" />
                  {errors.firstName.message}
                </p>
              )}
            </div>

            {/* Middle Name */}
            <div className="space-y-2">
              <label
                htmlFor="middleName"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Middle Name
              </label>
              <InputText
                id="middleName"
                {...register("middleName")}
                pt={{
                  root: {
                    className:
                      "w-full px-4 py-3 text-sm bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400",
                  },
                }}
                placeholder="Enter middle name"
              />
            </div>

            {/* Last Name */}
            <div className="space-y-2">
              <label
                htmlFor="lastName"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Last Name *
              </label>
              <InputText
                id="lastName"
                {...register("lastName", { required: "Last name is required" })}
                pt={{
                  root: {
                    className: `w-full px-4 py-3 text-sm bg-white dark:bg-gray-900 border ${
                      errors.lastName
                        ? "border-red-300 dark:border-red-700 focus:border-red-500 dark:focus:border-red-400"
                        : "border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400"
                    } rounded-lg transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400`,
                  },
                }}
                placeholder="Enter last name"
              />
              {errors.lastName && (
                <p className="text-xs text-red-500 dark:text-red-400 flex items-center gap-1">
                  <Icon icon="mdi:alert-circle" className="w-3 h-3" />
                  {errors.lastName.message}
                </p>
              )}
            </div>

            {/* Suffix */}
            <div className="space-y-2">
              <label
                htmlFor="suffix"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Suffix
              </label>
              <Dropdown
                id="suffix"
                value={watch("suffix")}
                onChange={(e) => setValue("suffix", e.value)}
                options={suffixOptions}
                placeholder="Select suffix"
                pt={{
                  root: {
                    className: "w-full",
                  },
                  input: {
                    className:
                      "px-4 py-3 text-sm bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500 focus:border-blue-500 dark:focus:border-blue-400 text-gray-900 dark:text-white",
                  },
                  panel: {
                    className:
                      "bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg",
                  },
                }}
              />
            </div>
          </div>
        </div>

        {/* Personal Details Section */}
        <div className="bg-gray-50/50 dark:bg-gray-800/50 rounded-xl p-6 border border-gray-200/50 dark:border-gray-700/50">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Icon icon="mdi:account-details" className="w-4 h-4" />
            Personal Details
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Gender */}
            <div className="space-y-2">
              <label
                htmlFor="gender"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Gender *
              </label>
              <Dropdown
                id="gender"
                value={watch("gender")}
                onChange={(e) => setValue("gender", e.value)}
                options={genderOptions}
                placeholder="Select gender"
                pt={{
                  root: {
                    className: "w-full",
                  },
                  input: {
                    className: `px-4 py-3 text-sm bg-white dark:bg-gray-900 border ${
                      errors.gender
                        ? "border-red-300 dark:border-red-700 focus:border-red-500 dark:focus:border-red-400"
                        : "border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400"
                    } rounded-lg transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500 text-gray-900 dark:text-white`,
                  },
                  panel: {
                    className:
                      "bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg",
                  },
                }}
              />
              {errors.gender && (
                <p className="text-xs text-red-500 dark:text-red-400 flex items-center gap-1">
                  <Icon icon="mdi:alert-circle" className="w-3 h-3" />
                  {errors.gender.message}
                </p>
              )}
            </div>

            {/* Local Number */}
            <div className="space-y-2">
              <label
                htmlFor="localNumber"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Local Number
              </label>
              <InputText
                id="localNumber"
                {...register("localNumber")}
                pt={{
                  root: {
                    className:
                      "w-full px-4 py-3 text-sm bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400",
                  },
                }}
                placeholder="Enter local number"
              />
            </div>

            {/* Address */}
            <div className="space-y-2 md:col-span-2">
              <label
                htmlFor="address"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Address *
              </label>
              <InputText
                id="address"
                {...register("address", { required: "Address is required" })}
                pt={{
                  root: {
                    className: `w-full px-4 py-3 text-sm bg-white dark:bg-gray-900 border ${
                      errors.address
                        ? "border-red-300 dark:border-red-700 focus:border-red-500 dark:focus:border-red-400"
                        : "border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400"
                    } rounded-lg transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400`,
                  },
                }}
                placeholder="Enter your full address"
              />
              {errors.address && (
                <p className="text-xs text-red-500 dark:text-red-400 flex items-center gap-1">
                  <Icon icon="mdi:alert-circle" className="w-3 h-3" />
                  {errors.address.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Work Information Section */}
        <div className="bg-gray-50/50 dark:bg-gray-800/50 rounded-xl p-6 border border-gray-200/50 dark:border-gray-700/50">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Icon icon="mdi:briefcase" className="w-4 h-4" />
            Work Information
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Job Title */}
            <div className="space-y-2">
              <label
                htmlFor="jobTitle"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Job Title
              </label>
              <InputText
                id="jobTitle"
                {...register("jobTitle")}
                pt={{
                  root: {
                    className:
                      "w-full px-4 py-3 text-sm bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400",
                  },
                }}
                placeholder="Enter job title"
              />
            </div>

            {/* Office Location */}
            <div className="space-y-2">
              <label
                htmlFor="officeLocation"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Office Location
              </label>
              <InputText
                id="officeLocation"
                {...register("officeLocation")}
                pt={{
                  root: {
                    className:
                      "w-full px-4 py-3 text-sm bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400",
                  },
                }}
                placeholder="Enter office location"
              />
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-end pt-4">
          <Button
            type="submit"
            disabled={isSubmitting}
            pt={{
              root: {
                className: `px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100 shadow-lg hover:shadow-xl disabled:shadow-none flex items-center gap-2 min-w-32 justify-center ${
                  isSubmitting ? "cursor-not-allowed" : "cursor-pointer"
                }`,
              },
            }}
          >
            {isSubmitting ? (
              <>
                <Icon icon="mdi:loading" className="w-4 h-4 animate-spin" />
                <span>Updating...</span>
              </>
            ) : (
              <>
                <Icon icon="mdi:content-save" className="w-4 h-4" />
                <span>Update Profile</span>
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default UserInfo;
