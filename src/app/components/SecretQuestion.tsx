"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { decodeUserData } from "../functions/functions";
import { toast } from "react-toastify";
import { toastClass } from "../tailwind-classes/tw_classes";
import apiClient from "../http-common/apiUrl";
import { API_BASE } from "../bindings/binding";
import { questions } from "../utils/misc/questions";

interface FormFields {
  secretQuestion: string;
  answer: string;
}

const SecretQuestion = () => {
  const { register, handleSubmit, setValue } = useForm<FormFields>();

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
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="flex w-72 mx-auto md:w-96 flex-col gap-4 p-4 border rounded-md shadow-md bg-white dark:bg-neutral-900 dark:border-black"
    >
      <h2 className="text-xl font-semibold">Set Secret Question</h2>

      <div className="flex flex-col">
        <label htmlFor="question" className="text-sm font-medium">
          Secret Question
        </label>
        <select
          onChange={(e) => {
            setValue("secretQuestion", e.target.value);
          }}
          id="question"
          className="mt-1 p-2 border rounded-md bg-inherit outline-none"
        >
          {questions.map((question: string, index) => (
            <option className="dark:bg-black" value={question} key={index}>
              {question}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col">
        <label htmlFor="answer" className="text-sm font-medium">
          Answer
        </label>
        <input
          {...register("answer", { required: true })}
          type="text"
          id="answer"
          placeholder="Enter your answer"
          className="mt-1 p-2 border rounded-md bg-inherit outline-none"
        />
      </div>

      <button
        type="submit"
        className="p-2 bg-neutral-900 text-white font-medium rounded-md hover:bg-neutral-800 transition dark:bg-white dark:text-black dark:hover:bg-neutral-200"
      >
        Save Secret Question
      </button>
    </form>
  );
};

export default SecretQuestion;
