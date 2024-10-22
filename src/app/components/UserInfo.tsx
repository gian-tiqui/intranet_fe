import React, { useEffect, useState } from "react";
import HoverBox from "./HoverBox";
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
  const [loading, setLoading] = useState<boolean>(true);
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
        } finally {
          setLoading(false);
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
    <form onSubmit={handleSubmit(handleEditProfile)}>
      <div className="flex flex-row-reverse">
        {saving ? (
          <HoverBox className="p-1 cursor-pointer rounded mb-5">
            <div className="flex items-center gap-3">
              <Icon
                icon={"material-symbols:save-outline"}
                className="w-5 h-5 animate-spin"
              />
              <p className="text-md">Saving...</p>
            </div>
          </HoverBox>
        ) : (
          <HoverBox className="hover:bg-neutral-300 dark:hover:bg-neutral-800 p-1 cursor-pointer rounded mb-5">
            <button type="submit" className="flex items-center gap-3">
              {mode === "save" ? (
                <>
                  <Icon icon={"lucide:edit"} className="w-5 h-5" />
                  <p className="text-md">Edit profile</p>
                </>
              ) : (
                <>
                  <Icon icon={"mingcute:save-line"} className="w-5 h-5" />
                  <p className="text-md">Save profile</p>
                </>
              )}
            </button>
          </HoverBox>
        )}
      </div>
      <div className="w-full flex flex-col gap-1">
        <div className="flex justify-between">
          <p>First name</p>
          <input
            {...register("firstName", { required: true })}
            disabled={mode === "save"}
            className={`${
              loading && "animate-pulse"
            } border-b dark:border-neutral-700 dark:bg-neutral-900 outline-none`}
          />
        </div>
        <div className="flex justify-between">
          <p>Middle name</p>
          <input
            {...register("middleName", { required: true })}
            disabled={mode === "save"}
            className={`${
              loading && "animate-pulse"
            } border-b dark:border-neutral-700 dark:bg-neutral-900 outline-none`}
          />
        </div>
        <div className="flex justify-between">
          <p>Last name</p>
          <input
            {...register("lastName", { required: true })}
            disabled={mode === "save"}
            className={`${
              loading && "animate-pulse"
            } border-b dark:border-neutral-700 dark:bg-neutral-900 outline-none`}
          />
        </div>
        <div className="flex justify-between">
          <p>Suffix</p>
          <input
            {...register("suffix")}
            disabled={mode === "save"}
            className={`${
              loading && "animate-pulse"
            } border-b dark:border-neutral-700 dark:bg-neutral-900 outline-none`}
          />
        </div>
        <div className="flex justify-between">
          <p>Gender</p>
          <input
            {...register("gender", { required: true })}
            disabled={mode === "save"}
            className={`${
              loading && "animate-pulse"
            } border-b dark:border-neutral-700 dark:bg-neutral-900 outline-none`}
          />
        </div>

        <div className="flex justify-between">
          <p>Address</p>
          <input
            {...register("address", { required: true })}
            disabled={mode === "save"}
            className={`${
              loading && "animate-pulse"
            } border-b dark:border-neutral-700 dark:bg-neutral-900 outline-none`}
          />
        </div>
      </div>
    </form>
  );
};

export default UserInfo;
