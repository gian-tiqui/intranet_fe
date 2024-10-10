"use client";
import React from "react";
import { useForm } from "react-hook-form";
import useDepartments from "@/app/custom-hooks/departments";
import apiClient from "@/app/http-common/apiUrl";
import { API_BASE } from "@/app/bindings/binding";
import { toast } from "react-toastify";

interface FormFields {
  email: string;
  password: string;
  firstName: string;
  middleName: string;
  lastName: string;
  lastNamePrefix: string;
  preferredName: string;
  suffix: string;
  address: string;
  city: string;
  state: string;
  zipCode: number;
  dob: Date;
  gender: string;
  deptId: number;
}

const AddUserModal = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormFields>();

  const departments = useDepartments();

  const onSubmit = async (data: FormFields) => {
    data.zipCode = Number(data.zipCode);
    data.deptId = Number(data.deptId);
    data.dob = new Date(new Date(data.dob).toISOString());

    try {
      const response = await apiClient.post(`${API_BASE}/auth/register`, {
        ...data,
      });

      if (response.data.statusCode === 201) {
        toast(response.data.message, { type: "success" });
      }
    } catch (error) {
      const err = error as { message: string };
      console.error(error);
      toast(err.message, { type: "error" });
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="p-6 max-w-md bg-white dark:bg-neutral-900 rounded-2xl h-96 w-96 overflow-auto shadow space-y-6"
    >
      <h1 className="text-xl mb-4 text-center font-bold">Add New User</h1>

      {/* EMAIL FIELD */}

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

      {/* PASSWORD FIELD */}

      <div className="h-14">
        <input
          type="password"
          {...register("password", { required: "Password is required" })}
          placeholder="Password"
          className="w-full h-10 bg-neutral-100 outline-none dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-2xl px-4"
        />
        {errors.password && (
          <p className="text-red-500 text-xs ms-4">{errors.password.message}</p>
        )}
      </div>

      {/* FIRST NAME FIELD */}

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

      {/* MIDDLE NAME FIELD */}

      <div className="h-14">
        <input
          type="text"
          {...register("middleName")}
          placeholder="Middle Name"
          className="w-full h-10 bg-neutral-100 outline-none dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-2xl px-4"
        />
      </div>

      {/* LAST NAME FIELD */}

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

      {/* LAST NAME PREFIX FIELD */}

      <div className="h-14">
        <input
          type="text"
          {...register("lastNamePrefix")}
          placeholder="Last Name Prefix"
          className="w-full h-10 bg-neutral-100 outline-none dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-2xl px-4"
        />
      </div>

      {/* PREFERRED NAME FIELD */}

      <div className="h-14">
        <input
          type="text"
          {...register("preferredName")}
          placeholder="Preferred Name"
          className="w-full h-10 bg-neutral-100 outline-none dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-2xl px-4"
        />
      </div>

      {/* SUFFIX FIELD */}

      <div className="h-14">
        <input
          type="text"
          {...register("suffix")}
          placeholder="Suffix"
          className="w-full h-10 bg-neutral-100 outline-none dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-2xl px-4"
        />
      </div>

      {/* ADDRESS FIELD */}

      <div className="h-14">
        <input
          type="text"
          {...register("address", { required: "Address is required" })}
          placeholder="Address"
          className="w-full h-10 bg-neutral-100 outline-none dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-2xl px-4"
        />
        {errors.address && (
          <p className="text-red-500 text-xs ms-4">{errors.address.message}</p>
        )}
      </div>

      {/* CITY FIELD */}

      <div className="h-14">
        <input
          type="text"
          {...register("city", { required: "City is required" })}
          placeholder="City"
          className="w-full h-10 bg-neutral-100 outline-none dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-2xl px-4"
        />
        {errors.city && (
          <p className="text-red-500 text-xs ms-4">{errors.city.message}</p>
        )}
      </div>

      {/* STATE FIELD */}

      <div className="h-14">
        <input
          type="text"
          {...register("state", { required: "State is required" })}
          placeholder="State"
          className="w-full h-10 bg-neutral-100 outline-none dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-2xl px-4"
        />
        {errors.state && (
          <p className="text-red-500 text-xs ms-4">{errors.state.message}</p>
        )}
      </div>

      {/* ZIP CODE FIELD */}

      <div className="h-14">
        <input
          type="number"
          {...register("zipCode", { required: "Zip code is required" })}
          placeholder="Zip Code"
          className="w-full h-10 bg-neutral-100 outline-none dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-2xl px-4"
        />
        {errors.zipCode && (
          <p className="text-red-500 text-xs ms-4">{errors.zipCode.message}</p>
        )}
      </div>

      {/* DOB FIELD */}

      <div className="h-14">
        <input
          type="datetime-local"
          {...register("dob", { required: "Date of birth is required" })}
          className="w-full h-10 bg-neutral-100 outline-none dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-2xl px-4"
        />
        {errors.dob && (
          <p className="text-red-500 text-xs ms-4">{errors.dob.message}</p>
        )}
      </div>

      {/* GENDER FIELD */}

      <div className="h-14">
        <select
          {...register("gender", { required: "Gender is required" })}
          className="w-full h-10 bg-neutral-100 outline-none dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-2xl px-4"
        >
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
        {errors.gender && (
          <p className="text-red-500 text-xs ms-4">{errors.gender.message}</p>
        )}
      </div>

      {/* DEPARTMENT ID FIELD */}

      <div className="h-14">
        <select
          {...register("deptId", { required: "Department ID is required" })}
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

      {/* SUBMIT BUTTON */}

      <button
        type="submit"
        className="w-full py-2 px-4 dark:bg-neutral-200 rounded-2xl bg-neutral-900 mt-4 hover:bg-gray-950 hover:dark:bg-neutral-300 text-white dark:text-black transition"
      >
        Submit
      </button>
    </form>
  );
};

export default AddUserModal;
