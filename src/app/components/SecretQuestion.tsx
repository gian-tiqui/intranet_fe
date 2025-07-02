"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { Icon } from "@iconify/react";
import { decodeUserData } from "../functions/functions";
import { toast } from "react-toastify";
import apiClient from "../http-common/apiUrl";
import { API_BASE } from "../bindings/binding";
import { questions } from "../utils/misc/questions";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";

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
    formState: { errors, isSubmitting },
  } = useForm<FormFields>();

  const handleFormSubmit = async (data: FormFields) => {
    const userId = decodeUserData()?.sub;

    if (userId) {
      try {
        const response = await apiClient.post(
          `${API_BASE}/users/secret-question?question=${data.secretQuestion}&answer=${data.answer}&userId=${userId}`
        );

        if (response.status === 201) {
          toast.success(response.data.message, {
            className:
              "bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-green-200 dark:border-green-800",
          });
        }
      } catch (error) {
        console.error(error);
        toast.error("There was a problem when saving your secret question", {
          className:
            "bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-red-200 dark:border-red-800",
        });
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center">
            <Icon icon="mdi:help-circle" className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Security Question
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Set up your account recovery question
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        {/* Security Question Section */}
        <div className="bg-gray-50/50 dark:bg-gray-800/50 rounded-xl p-6 border border-gray-200/50 dark:border-gray-700/50">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Icon icon="mdi:shield-question" className="w-4 h-4" />
            Account Recovery Setup
          </h4>

          <div className="space-y-4">
            {/* Secret Question Dropdown */}
            <div className="space-y-2">
              <label
                htmlFor="secretQuestion"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Security Question *
              </label>
              <Dropdown
                {...register("secretQuestion", {
                  required: "Please select a security question",
                })}
                value={watch("secretQuestion")}
                placeholder="Choose a security question"
                options={questions}
                onChange={(e: DropdownChangeEvent) => {
                  setValue("secretQuestion", e.value, { shouldValidate: true });
                }}
                pt={{
                  root: {
                    className: "w-full",
                  },
                  input: {
                    className: `px-4 py-3 text-sm bg-white dark:bg-gray-900 border ${
                      errors.secretQuestion
                        ? "border-red-300 dark:border-red-700 focus:border-red-500 dark:focus:border-red-400"
                        : "border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400"
                    } rounded-lg transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500 text-gray-900 dark:text-white`,
                  },
                  panel: {
                    className:
                      "bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg",
                  },
                  item: {
                    className:
                      "px-4 py-3 text-sm text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer",
                  },
                }}
              />
              {errors.secretQuestion && (
                <p className="text-xs text-red-500 dark:text-red-400 flex items-center gap-1">
                  <Icon icon="mdi:alert-circle" className="w-3 h-3" />
                  {errors.secretQuestion.message}
                </p>
              )}
            </div>

            {/* Answer Input */}
            <div className="space-y-2">
              <label
                htmlFor="answer"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Your Answer *
              </label>
              <InputText
                {...register("answer", {
                  required:
                    "Please provide an answer to your security question",
                  minLength: {
                    value: 2,
                    message: "Answer must be at least 2 characters long",
                  },
                })}
                type="text"
                id="answer"
                placeholder="Enter your answer"
                pt={{
                  root: {
                    className: `w-full px-4 py-3 text-sm bg-white dark:bg-gray-900 border ${
                      errors.answer
                        ? "border-red-300 dark:border-red-700 focus:border-red-500 dark:focus:border-red-400"
                        : "border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400"
                    } rounded-lg transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400`,
                  },
                }}
              />
              {errors.answer && (
                <p className="text-xs text-red-500 dark:text-red-400 flex items-center gap-1">
                  <Icon icon="mdi:alert-circle" className="w-3 h-3" />
                  {errors.answer.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Security Tips */}
        <div className="bg-amber-50/50 dark:bg-amber-900/20 rounded-xl p-4 border border-amber-200/50 dark:border-amber-800/50">
          <h5 className="text-sm font-medium text-amber-900 dark:text-amber-100 mb-2 flex items-center gap-2">
            <Icon icon="mdi:lightbulb" className="w-4 h-4" />
            Security Tips
          </h5>
          <ul className="text-xs text-amber-800 dark:text-amber-200 space-y-1">
            <li className="flex items-start gap-2">
              <Icon
                icon="mdi:check-circle"
                className="w-3 h-3 mt-0.5 flex-shrink-0"
              />
              Choose a question you&apos;ll remember the answer to
            </li>
            <li className="flex items-start gap-2">
              <Icon
                icon="mdi:check-circle"
                className="w-3 h-3 mt-0.5 flex-shrink-0"
              />
              Use an answer that won&apos;t change over time
            </li>
            <li className="flex items-start gap-2">
              <Icon
                icon="mdi:check-circle"
                className="w-3 h-3 mt-0.5 flex-shrink-0"
              />
              Avoid answers that others might easily guess
            </li>
            <li className="flex items-start gap-2">
              <Icon
                icon="mdi:check-circle"
                className="w-3 h-3 mt-0.5 flex-shrink-0"
              />
              This will help you recover your account if needed
            </li>
          </ul>
        </div>

        {/* Action Button */}
        <div className="flex justify-end pt-4">
          <Button
            type="submit"
            disabled={isSubmitting}
            pt={{
              root: {
                className: `px-8 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 disabled:from-gray-400 disabled:to-gray-500 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100 shadow-lg hover:shadow-xl disabled:shadow-none flex items-center gap-2 min-w-40 justify-center ${
                  isSubmitting ? "cursor-not-allowed" : "cursor-pointer"
                }`,
              },
            }}
          >
            {isSubmitting ? (
              <>
                <Icon icon="mdi:loading" className="w-4 h-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Icon icon="mdi:shield-check" className="w-4 h-4" />
                <span>Save Security Question</span>
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SecretQuestion;
