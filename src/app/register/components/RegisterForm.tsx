"use client";
import { API_BASE } from "@/app/bindings/binding";
import apiClient from "@/app/http-common/apiUrl";
import { User } from "@/app/types/types";
import { jwtDecode } from "jwt-decode";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";

interface Props {
  hashedMmployeeId: number;
}

interface FormFields {
  email: string;
  password: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: number;
  dob: Date;
  gender: string;
  lid: string;
  employeeId: string;
  deptId: number;
}

const RegisterForm: React.FC<Props> = ({ hashedMmployeeId }) => {
  const { sub } = jwtDecode<{ sub: string }>(String(hashedMmployeeId));
  const { register, setValue } = useForm<FormFields>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiClient.get(
          `${API_BASE}/auth/user?employeeId=${sub}`
        );
        const userData = response.data as User & {
          employeeId: string;
          lid: string;
        };


        setValue("email", userData.email);
        setValue("firstName", userData.firstName);
        setValue("middleName", userData.middleName);
        setValue("lastName", userData.lastName);
        setValue("address", userData.address);
        setValue("city", userData.city);
        setValue("state", userData.state);
        setValue("zipCode", userData.zipCode);
        setValue("dob", new Date(userData.dob));
        setValue("gender", userData.gender);
        setValue("lid", userData.lid);
        setValue("employeeId", userData.employeeId);
        setValue("deptId", userData.deptId);
      } catch (error) {
        console.error("There was an error fetching your data: ", error);
      }
    };

    fetchData();
  }, [sub, setValue]);

  return (
    <div className="w-screen h-screen grid place-content-center">
      <form className="w-96 bg-white shadow rounded-2xl p-4 flex flex-col gap-2">
        <input
          {...register("email")}
          placeholder="Email"
          className="input-field"
        />
        <input
          {...register("firstName")}
          placeholder="First Name"
          className="input-field"
        />
        <input
          {...register("middleName")}
          placeholder="Middle Name"
          className="input-field"
        />
        <input
          {...register("lastName")}
          placeholder="Last Name"
          className="input-field"
        />
        <input
          {...register("address")}
          placeholder="Address"
          className="input-field"
        />
        <input
          {...register("city")}
          placeholder="City"
          className="input-field"
        />
        <input
          {...register("state")}
          placeholder="State"
          className="input-field"
        />
        <input
          type="number"
          {...register("zipCode")}
          placeholder="Zip Code"
          className="input-field"
        />
        <input
          type="date"
          {...register("dob")}
          placeholder="Date of Birth"
          className="input-field"
        />
        <input
          {...register("gender")}
          placeholder="Gender"
          className="input-field"
        />

        <button type="submit">Activate</button>
      </form>
    </div>
  );
};

export default RegisterForm;
