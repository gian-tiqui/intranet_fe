import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import apiClient from "../http-common/apiUrl";
import { API_BASE, INTRANET } from "../bindings/binding";
import { decodeUserData } from "../functions/functions";
import { User } from "../types/types";

interface Props {
  mode: string;
  handleModeChange: () => void;
}

interface FormFields {
  firstName: string | undefined;
  middleName: string | undefined;
  lastName: string | undefined;
  suffix: string | undefined;
  gender: string | undefined;
  dob: Date | undefined;
  address: string | undefined;
}

const UserInfo: React.FC<Props> = ({ mode, handleModeChange }) => {
  const { register, handleSubmit, setValue } = useForm<FormFields>();
  const [user, setUser] = useState<User | undefined>(undefined);
  const [saving, setSaving] = useState<boolean>(false);

  const handleEditProfile = async (data: FormFields) => {
    const userId = decodeUserData()?.sub;
    if (mode === "save") {
      handleModeChange();
      return;
    } else {
      try {
        setSaving(true);
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
      } finally {
        handleModeChange();
        setSaving(false);
      }
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
    <form
      onSubmit={handleSubmit(handleEditProfile)}
      className="flex w-72 mx-auto md:w-96 flex-col gap-4 p-4 border rounded-md shadow-md bg-white dark:bg-neutral-900 dark:border-black"
    >
      <div className="flex justify-end">
        {saving ? (
          <div className="flex items-center gap-3 p-2 rounded-md bg-neutral-200 dark:bg-neutral-800">
            <Icon
              icon={"material-symbols:save-outline"}
              className="w-5 h-5 animate-spin"
            />
            <p className="text-md">Saving...</p>
          </div>
        ) : (
          <button
            type="submit"
            className="flex items-center gap-3 p-2 bg-neutral-900 text-white font-medium rounded-md hover:bg-neutral-800 transition dark:bg-white dark:text-black dark:hover:bg-neutral-200"
          >
            {mode === "save" ? (
              <>
                <Icon icon={"lucide:edit"} className="w-5 h-5" />
                <p className="text-md">Edit Profile</p>
              </>
            ) : (
              <>
                <Icon icon={"mingcute:save-line"} className="w-5 h-5" />
                <p className="text-md">Save Profile</p>
              </>
            )}
          </button>
        )}
      </div>

      <div className="flex flex-col gap-4">
        {/* First Name */}
        <div className="flex flex-col">
          <label htmlFor="firstName" className="text-sm font-medium">
            First Name
          </label>
          <input
            id="firstName"
            {...register("firstName", { required: true })}
            disabled={mode === "save"}
            className="mt-1 p-2 border rounded-md bg-inherit outline-none"
          />
        </div>

        {/* Middle Name */}
        <div className="flex flex-col">
          <label htmlFor="middleName" className="text-sm font-medium">
            Middle Name
          </label>
          <input
            id="middleName"
            {...register("middleName", { required: false })}
            disabled={mode === "save"}
            className="mt-1 p-2 border rounded-md bg-inherit outline-none"
          />
        </div>

        {/* Last Name */}
        <div className="flex flex-col">
          <label htmlFor="lastName" className="text-sm font-medium">
            Last Name
          </label>
          <input
            id="lastName"
            {...register("lastName", { required: true })}
            disabled={mode === "save"}
            className="mt-1 p-2 border rounded-md bg-inherit outline-none"
          />
        </div>

        {/* Suffix */}
        <div className="flex flex-col">
          <label htmlFor="suffix" className="text-sm font-medium">
            Suffix
          </label>
          <input
            id="suffix"
            {...register("suffix")}
            disabled={mode === "save"}
            className="mt-1 p-2 border rounded-md bg-inherit outline-none"
          />
        </div>

        {/* Gender */}
        <div className="flex flex-col">
          <label htmlFor="gender" className="text-sm font-medium">
            Gender
          </label>
          <input
            id="gender"
            {...register("gender", { required: true })}
            disabled={mode === "save"}
            className="mt-1 p-2 border rounded-md bg-inherit outline-none"
          />
        </div>

        {/* Address */}
        <div className="flex flex-col">
          <label htmlFor="address" className="text-sm font-medium">
            Address
          </label>
          <input
            id="address"
            {...register("address", { required: true })}
            disabled={mode === "save"}
            className="mt-1 p-2 border rounded-md bg-inherit outline-none"
          />
        </div>
      </div>
    </form>
  );
};

export default UserInfo;
