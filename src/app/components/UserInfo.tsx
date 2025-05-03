import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import apiClient from "../http-common/apiUrl";
import { API_BASE, INTRANET } from "../bindings/binding";
import { decodeUserData } from "../functions/functions";
import { User } from "../types/types";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";

interface FormFields {
  firstName: string | undefined;
  middleName: string | undefined;
  lastName: string | undefined;
  suffix: string | undefined;
  gender: string | undefined;
  dob: Date | undefined;
  address: string | undefined;
}

const UserInfo = () => {
  const { register, handleSubmit, setValue } = useForm<FormFields>();
  const [user, setUser] = useState<User | undefined>(undefined);

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
        toast(response.data.message, {
          type: "success",
          className: "bg-neutral-200 dark:bg-neutral-900",
        });
      }
    } catch (error) {
      const { message } = error as { message: string };

      toast(message, {
        type: "error",
        className: "bg-neutral-200 dark:bg-neutral-900",
      });
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const userId = decodeUserData()?.sub;

      if (userId) {
        try {
          const response = await apiClient.get(`${API_BASE}/users/${userId}`);

          if (response.data.statusCode === 200) {
            setUser(response.data.user);
          }
        } catch (error) {
          const { message } = error as { message: string };

          toast(message, { type: "error" });
        }
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const setFields = () => {
      if (user) {
        setValue("firstName", user.firstName);
        setValue("middleName", user.middleName);
        setValue("lastName", user.lastName);
        setValue("address", user.address);
        setValue("gender", user.gender);
        setValue("suffix", user.suffix);
      }
    };

    setFields();
  }, [user, setValue]);

  return (
    <form onSubmit={handleSubmit(handleEditProfile)} className="w-96 mx-auto">
      <div className="flex flex-col gap-4">
        {/* First Name */}
        <div className="flex flex-col h-20">
          <label htmlFor="firstName" className="text-xs mb-1 font-medium">
            First Name
          </label>
          <InputText
            id="firstName"
            {...register("firstName", { required: true })}
            className="px-4 text-xs h-10 bg-white border border-black"
          />
        </div>

        {/* Middle Name */}
        <div className="flex flex-col h-20">
          <label htmlFor="middleName" className="text-xs mb-1 font-medium">
            Middle Name
          </label>
          <InputText
            id="middleName"
            {...register("middleName", { required: false })}
            className="px-4 text-xs h-10 bg-white border border-black"
          />
        </div>

        {/* Last Name */}
        <div className="flex flex-col h-20">
          <label htmlFor="lastName" className="text-xs mb-1 font-medium">
            Last Name
          </label>
          <InputText
            id="lastName"
            {...register("lastName", { required: true })}
            className="px-4 text-xs h-10 bg-white border border-black"
          />
        </div>

        {/* Suffix */}
        <div className="flex flex-col h-20">
          <label htmlFor="suffix" className="text-xs mb-1 font-medium">
            Suffix
          </label>
          <InputText
            id="suffix"
            {...register("suffix")}
            className="px-4 text-xs h-10 bg-white border border-black"
          />
        </div>

        {/* Gender */}
        <div className="flex flex-col h-20">
          <label htmlFor="gender" className="text-xs mb-1 font-medium">
            Gender
          </label>
          <InputText
            id="gender"
            {...register("gender", { required: true })}
            className="px-4 text-xs h-10 bg-white border border-black"
          />
        </div>

        {/* Address */}
        <div className="flex flex-col h-20">
          <label htmlFor="address" className="text-xs mb-1 font-medium">
            Address
          </label>
          <InputText
            id="address"
            {...register("address", { required: true })}
            className="px-4 text-xs h-10 bg-white border border-black"
          />
        </div>
      </div>
      <Button className="bg-blue-600 justify-center text-white font-bold w-full h-10 mt-5">
        Update
      </Button>
    </form>
  );
};

export default UserInfo;
