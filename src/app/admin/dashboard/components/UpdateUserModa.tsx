"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import useDepartments from "@/app/custom-hooks/departments";
import apiClient from "@/app/http-common/apiUrl";
import { API_BASE } from "@/app/bindings/binding";
import { toast } from "react-toastify";
import userIdStore from "@/app/store/userId";

interface FormFields {
  email: string;
  password?: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  lastNamePrefix?: string;
  preferredName?: string;
  suffix?: string;
  address: string;
  city: string;
  state: string;
  zipCode: number;
  dob: string;
  gender: string;
  deptId: number;
  employeeId?: string;
}

const UpdateUserModal = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormFields>();
  const { selectedId } = userIdStore();
  const departments = useDepartments();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get(`${API_BASE}/users/${selectedId}`);
        const userData = response.data.user;

        const dobDate = new Date(userData.dob);
        const formattedDob = dobDate.toISOString().slice(0, 16);

        setValue("email", userData.email);
        setValue("firstName", userData.firstName);
        setValue("middleName", userData.middleName);
        setValue("lastName", userData.lastName);
        setValue("lastNamePrefix", userData.lastNamePrefix);
        setValue("preferredName", userData.preferredName);
        setValue("suffix", userData.suffix);
        setValue("address", userData.address);
        setValue("city", userData.city);
        setValue("state", userData.state);
        setValue("zipCode", userData.zipCode);
        setValue("dob", formattedDob);
        setValue("gender", userData.gender);
        setValue("deptId", userData.deptId);
        setValue("employeeId", userData.employeeId);

        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
        toast("Failed to load user data", { type: "error" });
      }
    };

    loadUserData();
  }, [selectedId, setValue]);

  const onSubmit = async (data: FormFields) => {
    data.zipCode = Number(data.zipCode);
    data.deptId = Number(data.deptId);

    try {
      const response = await apiClient.put(`${API_BASE}/users/${selectedId}`, {
        ...data,
      });

      if (response.status === 200) {
        toast("User updated successfully", { type: "success" });
      }
    } catch (error) {
      const err = error as { message: string };
      console.error(error);
      toast(err.message, { type: "error" });
    }
  };

  return loading ? (
    <p>Loading...</p>
  ) : (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="p-6 max-w-md bg-white dark:bg-neutral-900 rounded-2xl h-96 w-[800px] overflow-auto shadow space-y-6"
    >
      <h1 className="text-xl mb-4 text-center font-bold">Update User</h1>

      <div className="h-14">
        <input
          {...register("employeeId", { required: "Employee id is required" })}
          placeholder="Employee ID"
          className="w-full h-10 bg-neutral-100 outline-none dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-2xl px-4"
        />
        {errors.employeeId && (
          <p className="text-red-500 text-xs ms-4">
            {errors.employeeId.message}
          </p>
        )}
      </div>

      <div className="h-14">
        <input
          type="email"
          {...register("email", { required: "Email is required" })}
          placeholder="Email"
          className="w-full h-10 bg-neutral-100 outline-none dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-2xl px-4"
        />
        {errors.email && (
          <p className="text-red-500 text-xs ms-4">{errors.email.message}</p>
        )}
      </div>

      <div className="h-14">
        <input
          type="password"
          {...register("password")}
          placeholder="Password"
          className="w-full h-10 bg-neutral-100 outline-none dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-2xl px-4"
        />
        {errors.password && (
          <p className="text-red-500 text-xs ms-4">{errors.password.message}</p>
        )}
      </div>

      <div className="h-14">
        <input
          type="text"
          {...register("firstName", { required: "First name is required" })}
          placeholder="First Name"
          className="w-full h-10 bg-neutral-100 outline-none dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-2xl px-4"
        />
        {errors.firstName && (
          <p className="text-red-500 text-xs ms-4">
            {errors.firstName.message}
          </p>
        )}
      </div>

      <div className="h-14">
        <input
          type="text"
          {...register("middleName")}
          placeholder="Middle Name"
          className="w-full h-10 bg-neutral-100 outline-none dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-2xl px-4"
        />
      </div>

      <div className="h-14">
        <input
          type="text"
          {...register("lastName", { required: "Last name is required" })}
          placeholder="Last Name"
          className="w-full h-10 bg-neutral-100 outline-none dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-2xl px-4"
        />
        {errors.lastName && (
          <p className="text-red-500 text-xs ms-4">{errors.lastName.message}</p>
        )}
      </div>

      <div className="h-14">
        <input
          type="text"
          {...register("lastNamePrefix")}
          placeholder="Last Name Prefix"
          className="w-full h-10 bg-neutral-100 outline-none dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-2xl px-4"
        />
      </div>

      <div className="h-14">
        <input
          type="text"
          {...register("preferredName")}
          placeholder="Preferred Name"
          className="w-full h-10 bg-neutral-100 outline-none dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-2xl px-4"
        />
      </div>

      <div className="h-14">
        <input
          type="text"
          {...register("suffix")}
          placeholder="Suffix"
          className="w-full h-10 bg-neutral-100 outline-none dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-2xl px-4"
        />
      </div>

      <div className="h-14">
        <input
          type="text"
          {...register("address")}
          placeholder="Address"
          className="w-full h-10 bg-neutral-100 outline-none dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-2xl px-4"
        />
        {errors.address && (
          <p className="text-red-500 text-xs ms-4">{errors.address.message}</p>
        )}
      </div>

      <div className="h-14">
        <input
          type="text"
          {...register("city")}
          placeholder="City"
          className="w-full h-10 bg-neutral-100 outline-none dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-2xl px-4"
        />
        {errors.city && (
          <p className="text-red-500 text-xs ms-4">{errors.city.message}</p>
        )}
      </div>

      <div className="h-14">
        <input
          type="text"
          {...register("state")}
          placeholder="State"
          className="w-full h-10 bg-neutral-100 outline-none dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-2xl px-4"
        />
        {errors.state && (
          <p className="text-red-500 text-xs ms-4">{errors.state.message}</p>
        )}
      </div>

      <div className="h-14">
        <input
          type="number"
          {...register("zipCode")}
          placeholder="Zip Code"
          className="w-full h-10 bg-neutral-100 outline-none dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-2xl px-4"
        />
        {errors.zipCode && (
          <p className="text-red-500 text-xs ms-4">{errors.zipCode.message}</p>
        )}
      </div>

      {/*
       * @TODO:
       * Fix the input of date and should insert exactly like this format (1990-01-15T00:00:00.000Z)
       *
       */}
      <div className="h-14">
        <input
          type="datetime-local"
          {...register("dob")}
          className="w-full h-10 bg-neutral-100 outline-none dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-2xl px-4"
        />
        {errors.dob && (
          <p className="text-red-500 text-xs ms-4">{errors.dob.message}</p>
        )}
      </div>

      <div className="h-14">
        <select
          {...register("gender")}
          className="w-full h-10 bg-neutral-100 outline-none dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-2xl px-4"
        >
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
        {errors.gender && (
          <p className="text-red-500 text-xs ms-4">{errors.gender.message}</p>
        )}
      </div>

      <div className="h-14">
        <select
          {...register("deptId")}
          className="w-full h-10 bg-neutral-100 dark:bg-neutral-800 border outline-none border-neutral-300 dark:border-neutral-700 rounded-2xl px-4"
        >
          {departments.map((department) => (
            <option key={department.deptId} value={department.deptId}>
              {department.departmentName}
            </option>
          ))}
        </select>
        {errors.deptId && (
          <p className="text-red-500 text-xs ms-4">Department is required</p>
        )}
      </div>

      <button
        type="submit"
        className="w-full py-2 px-4 dark:bg-neutral-200 rounded-2xl bg-neutral-900 mt-4 hover:bg-gray-950 hover:dark:bg-neutral-300 text-white dark:text-black transition"
      >
        Update User
      </button>
    </form>
  );
};

export default UpdateUserModal;
