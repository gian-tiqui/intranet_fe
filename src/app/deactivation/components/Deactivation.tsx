"use client";
import { API_BASE } from "@/app/bindings/binding";
import { decodeUserData } from "@/app/functions/functions";
import apiClient from "@/app/http-common/apiUrl";
import useUserStore from "@/app/store/userStore";
import { toastClass } from "@/app/tailwind-classes/tw_classes";
import { User } from "@/app/types/types";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

interface FormFields {
  employeeId: number;
}

const Deactivation = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormFields>();
  const [value, setVal] = useState<number>(0);
  const { setUser } = useUserStore();

  useEffect(() => {
    const validateRole = () => {
      const deptId = decodeUserData()?.deptId;

      if (deptId && deptId !== 3) {
        toast("You are not authorized to view this page.", {
          className: toastClass,
          type: "error",
        });

        router.push("/bulletin");
        return;
      }
    };

    validateRole();
  }, [router]);

  const handleFormSubmit = async (data: FormFields) => {
    if (!data.employeeId) return;
    try {
      const response = await apiClient(
        `${API_BASE}/users/employeeId?employeeId=${data.employeeId}`
      );

      if (response.status === 200) {
        console.log(response.data);
        setUser(response.data as User);
      }
    } catch (error) {
      console.error(error);
      const {
        response: {
          data: { message },
        },
      } = error as { response: { data: { message: string } } };

      toast(message, { type: "error", className: toastClass });
    }
  };

  return (
    <div className="w-full h-[85vh] grid place-content-center">
      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        className="w-80 bg-white flex flex-col justify-between items-center gap-8 p-3 shadow rounded"
      >
        {" "}
        <h1 className="text-xl font-bold text-center">Select employee ID</h1>
        <div className="w-72 px-3 h-10 rounded grid place-content-center bg-neutral-200 dark:bg-neutral-700">
          <p className="font-extrabold text-lg truncate">{value}</p>
        </div>
        <div>
          <input
            className="w-72 rounded h-10 font-extrabold px-3 text-center bg-neutral-200 outline-none"
            {...register("employeeId", { required: true })}
            placeholder="enter employee id"
            type="number"
            onChange={(e) => {
              setVal(+e.target.value);
              setValue("employeeId", +e.target.value);
            }}
          />
          {errors.employeeId && <p>Employee id is required</p>}
        </div>
        <button className="h-10 w-full font-semibold bg-neutral-900 text-white rounded">
          Submit
        </button>
      </form>
    </div>
  );
};

export default Deactivation;
