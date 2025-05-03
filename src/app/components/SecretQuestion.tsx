"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { decodeUserData } from "../functions/functions";
import { toast } from "react-toastify";
import { toastClass } from "../tailwind-classes/tw_classes";
import apiClient from "../http-common/apiUrl";
import { API_BASE } from "../bindings/binding";
import { questions } from "../utils/misc/questions";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import MotionP from "./animation/MotionP";

interface FormFields {
  secretQuestion: string;
  answer: string;
}

const SecretQuestion = () => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormFields>();

  const handleFormSubmit = async (data: FormFields) => {
    const userId = decodeUserData()?.sub;

    if (userId) {
      try {
        const response = await apiClient.post(
          `${API_BASE}/users/secret-question?question=${data.secretQuestion}&answer=${data.answer}&userId=${userId}`
        );

        if (response.status === 201) {
          toast(response.data.message, {
            type: "success",
            className: toastClass,
          });
        }
      } catch (error) {
        console.error(error);
        toast("There was a problem when saving your secret", {
          type: "error",
          className: toastClass,
        });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="w-96 mx-auto">
      <div className="flex flex-col h-24">
        <label htmlFor="answer" className="text-xs font-medium">
          Question
        </label>
        <Dropdown
          {...register("secretQuestion", {
            required: "Secret question is required",
          })}
          value={watch("secretQuestion")}
          options={questions}
          onChange={(e: DropdownChangeEvent) => {
            setValue("secretQuestion", e.value, { shouldValidate: true });
          }}
          className="h-10 items-center"
        />

        {errors.secretQuestion && (
          <MotionP className="text-red-500 text-xs">
            {errors.secretQuestion.message}
          </MotionP>
        )}
      </div>

      <div className="flex flex-col h-24">
        <label htmlFor="answer" className="text-xs font-medium">
          Answer
        </label>
        <InputText
          {...register("answer", { required: "Answer is required" })}
          type="text"
          id="answer"
          placeholder="Enter your answer"
          className="my-1 p-2 border rounded-md bg-inherit outline-none border-black bg-white text-sm h-10 px-4"
        />
        {errors.answer && (
          <MotionP className="text-red-500 text-xs">
            {errors.answer.message}
          </MotionP>
        )}
      </div>

      <Button
        type="submit"
        className="justify-center w-full bg-blue-600 h-10 text-white font-bold"
      >
        Save Secret Question
      </Button>
    </form>
  );
};

export default SecretQuestion;
