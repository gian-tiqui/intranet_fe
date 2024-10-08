"use client";
import React from "react";
import { useForm } from "react-hook-form";

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

  const onSubmit = (data: FormFields) => {
    console.log(data);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-96 p-4 bg-neutral-200 dark:bg-neutral-900 rounded-2xl space-y-4"
    >
      {/* Email */}
      <div>
        <input
          type="email"
          {...register("email", { required: "Email is required" })}
          className="input-field"
        />
        {errors.email && <p className="text-red-500">{errors.email.message}</p>}
      </div>

      {/* Password */}
      <div>
        <input
          type="password"
          {...register("password", { required: "Password is required" })}
          className="input-field"
        />
        {errors.password && (
          <p className="text-red-500">{errors.password.message}</p>
        )}
      </div>

      {/* First Name */}
      <div>
        <input
          type="text"
          {...register("firstName", { required: "First name is required" })}
          className="input-field"
        />
        {errors.firstName && (
          <p className="text-red-500">{errors.firstName.message}</p>
        )}
      </div>

      {/* Middle Name */}
      <div>
        <input
          type="text"
          {...register("middleName")}
          className="input-field"
        />
      </div>

      {/* Last Name */}
      <div>
        <input
          type="text"
          {...register("lastName", { required: "Last name is required" })}
          className="input-field"
        />
        {errors.lastName && (
          <p className="text-red-500">{errors.lastName.message}</p>
        )}
      </div>

      {/* Last Name Prefix */}
      <div>
        <input
          type="text"
          {...register("lastNamePrefix")}
          className="input-field"
        />
      </div>

      {/* Preferred Name */}
      <div>
        <input
          type="text"
          {...register("preferredName")}
          className="input-field"
        />
      </div>

      {/* Suffix */}
      <div>
        <input type="text" {...register("suffix")} className="input-field" />
      </div>

      {/* Address */}
      <div>
        <input
          type="text"
          {...register("address", { required: "Address is required" })}
          className="input-field"
        />
        {errors.address && (
          <p className="text-red-500">{errors.address.message}</p>
        )}
      </div>

      {/* City */}
      <div>
        <input
          type="text"
          {...register("city", { required: "City is required" })}
          className="input-field"
        />
        {errors.city && <p className="text-red-500">{errors.city.message}</p>}
      </div>

      {/* State */}
      <div>
        <input
          type="text"
          {...register("state", { required: "State is required" })}
          className="input-field"
        />
        {errors.state && <p className="text-red-500">{errors.state.message}</p>}
      </div>

      {/* Zip Code */}
      <div>
        <input
          type="number"
          {...register("zipCode", { required: "Zip code is required" })}
          className="input-field"
        />
        {errors.zipCode && (
          <p className="text-red-500">{errors.zipCode.message}</p>
        )}
      </div>

      {/* Date of Birth */}
      <div>
        <input
          type="date"
          {...register("dob", { required: "Date of birth is required" })}
          className="input-field"
        />
        {errors.dob && <p className="text-red-500">{errors.dob.message}</p>}
      </div>

      {/* Gender */}
      <div>
        <select
          {...register("gender", { required: "Gender is required" })}
          className="input-field"
        >
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
        {errors.gender && (
          <p className="text-red-500">{errors.gender.message}</p>
        )}
      </div>

      {/* Department */}
      <div>
        <input
          type="number"
          {...register("deptId", { required: "Department ID is required" })}
          className="input-field"
        />
        {errors.deptId && (
          <p className="text-red-500">{errors.deptId.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <div className="mt-4">
        <button
          type="submit"
          className="w-full p-2 bg-blue-500 text-white rounded"
        >
          Add User
        </button>
      </div>
    </form>
  );
};

export default AddUserModal;
