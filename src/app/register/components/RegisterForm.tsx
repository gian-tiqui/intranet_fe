"use client";
import { API_BASE } from "@/app/bindings/binding";
import ModeToggler from "@/app/components/ModeToggler";
import apiClient from "@/app/http-common/apiUrl";
import { toastClass } from "@/app/tailwind-classes/tw_classes";
import { User } from "@/app/types/types";
import { format } from "date-fns";
import { jwtDecode } from "jwt-decode";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

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
  dob: Date | string;
  gender: string;
  lid: string;
  employeeId: string;
  deptId: number;
}

const RegisterForm: React.FC<Props> = ({ hashedMmployeeId }) => {
  const { sub, exp } = jwtDecode<{ sub: string; exp: number }>(
    String(hashedMmployeeId)
  );
  const router = useRouter();
  const { register, setValue, handleSubmit } = useForm<FormFields>();
  const [isTokenExpired, setIsTokenExpired] = useState(false);

  useEffect(() => {
    const now = Math.floor(Date.now() / 1000);
    if (exp < now) {
      setIsTokenExpired(true);
      return;
    }

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

        const formattedDob = format(new Date(userData.dob), "yyyy-MM-dd");
        setValue("dob", formattedDob);
        setValue("gender", userData.gender);
        setValue("lid", userData.lid);
        setValue("employeeId", userData.employeeId);
        setValue("deptId", userData.deptId);
      } catch (error) {
        console.error("There was an error fetching your data: ", error);
      }
    };

    fetchData();
  }, [sub, exp, setValue]);

  const handleRegister = async (data: FormFields) => {
    try {
      const formattedDob =
        typeof data.dob === "string"
          ? data.dob
          : format(data.dob, "yyyy-MM-dd");

      const response = await apiClient.post(`${API_BASE}/auth/register`, {
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        middleName: data.middleName,
        lastName: data.lastName,
        lastNamePrefix: "",
        preferredName: "",
        suffix: "",
        address: data.address,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode,
        dob: formattedDob,
        gender: data.gender,
        deptId: data.deptId,
        employeeId: data.employeeId,
        lid: data.lid,
      });

      if (response.status === 201) {
        toast(response.data.message, {
          className: toastClass,
          type: "success",
        });

        router.push("/login");
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (isTokenExpired) {
    return <TokenExpired />;
  }

  return (
    <div className="h-screen grid place-content-center">
      <div className="absolute top-5 right-5">
        <ModeToggler />
      </div>

      <form
        onSubmit={handleSubmit(handleRegister)}
        className="w-96 bg-white dark:bg-neutral-900 shadow p-6 rounded-lg"
      >
        <div className="w-full">
          <h1 className="text-2xl mb-6 font-extrabold text-center">
            Confirm your details
          </h1>
        </div>
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          {[
            { label: "Email", name: "email", type: "text" },
            { label: "First Name", name: "firstName", type: "text" },
            { label: "Middle Name", name: "middleName", type: "text" },
            { label: "Last Name", name: "lastName", type: "text" },
            { label: "Address", name: "address", type: "text" },
            { label: "City", name: "city", type: "text" },
            { label: "State", name: "state", type: "text" },
            { label: "Zip Code", name: "zipCode", type: "number" },
            { label: "Date of Birth", name: "dob", type: "date" },
            { label: "Gender", name: "gender", type: "text" },
            { label: "Password", name: "password", type: "password" },
          ].map((field) => (
            <div key={field.name} className="relative">
              <input
                {...register(field.name as keyof FormFields)}
                type={field.type}
                className="peer bg-inherit border border-gray-400 dark:border-gray-600 rounded-md p-3 w-full focus:border-blue-500 focus:outline-none"
                placeholder=" "
              />
              <label className="absolute text-gray-500 dark:text-gray-400 duration-200 transform -translate-y-4 scale-75 top-2 left-3 origin-[0] bg-white dark:bg-neutral-900 px-1 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4">
                {field.label}
              </label>
            </div>
          ))}
        </div>

        <button
          type="submit"
          className="bg-black text-white dark:bg-white dark:text-black w-full h-10 rounded-md font-semibold"
        >
          Activate your account
        </button>
      </form>
    </div>
  );
};

const TokenExpired: React.FC = () => (
  <div className="w-screen h-screen flex items-center justify-center">
    <div className="absolute top-3 right-3">
      <ModeToggler />
    </div>
    <div className="text-center">
      <h2 className="text-2xl font-bold">Session has expired.</h2>
      <p className="mb-5">Please activate again to continue.</p>
      <Link href={"activate"} className="text-white dark:text-black">
        <div className="bg-black dark:bg-white w-32 mx-auto rounded-xl h-8 flex items-center justify-center font-semibold">
          Go back
        </div>
      </Link>
    </div>
  </div>
);

export default RegisterForm;
