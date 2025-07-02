import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Icon } from "@iconify/react";
import apiClient from "../http-common/apiUrl";
import { API_BASE, INTRANET } from "../bindings/binding";
import { decodeUserData } from "../functions/functions";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";

interface FormFields {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

const Password = () => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>();

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const newPassword = watch("newPassword");

  const onPasswordReset = async (data: FormFields) => {
    // Check if new passwords match
    if (data.newPassword !== data.confirmNewPassword) {
      toast.error("New passwords do not match", {
        className:
          "bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-red-200 dark:border-red-800",
      });
      return;
    }

    const userId = decodeUserData()?.sub;

    if (userId) {
      try {
        const response = await apiClient.post(
          `${API_BASE}/users/password`,
          {
            oldPassword: data.currentPassword,
            newPassword: data.newPassword,
            userId: userId,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem(INTRANET)}`,
            },
          }
        );

        if (response.data.statusCode === 200) {
          toast.success(response.data.message, {
            className:
              "bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-green-200 dark:border-green-800",
          });
          reset();
        }
      } catch (error) {
        const { message } = error as { message: string };

        toast.error(message, {
          className:
            "bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-red-200 dark:border-red-800",
        });
      }
    }
  };

  const getPasswordStrength = (password: string) => {
    if (!password) return { strength: 0, label: "", color: "" };

    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    const strengthMap = {
      0: { label: "Very Weak", color: "bg-red-500" },
      1: { label: "Weak", color: "bg-red-400" },
      2: { label: "Fair", color: "bg-yellow-500" },
      3: { label: "Good", color: "bg-blue-500" },
      4: { label: "Strong", color: "bg-green-500" },
      5: { label: "Very Strong", color: "bg-green-600" },
    };

    return { strength, ...strengthMap[strength as keyof typeof strengthMap] };
  };

  const passwordStrength = getPasswordStrength(newPassword || "");

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center">
            <Icon icon="mdi:lock-reset" className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Change Password
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Update your account password
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onPasswordReset)} className="space-y-6">
        {/* Password Change Section */}
        <div className="bg-gray-50/50 dark:bg-gray-800/50 rounded-xl p-6 border border-gray-200/50 dark:border-gray-700/50">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Icon icon="mdi:shield-key" className="w-4 h-4" />
            Password Security
          </h4>

          <div className="space-y-4">
            {/* Current Password */}
            <div className="space-y-2">
              <label
                htmlFor="currentPassword"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Current Password *
              </label>
              <div className="relative">
                <InputText
                  type={showCurrentPassword ? "text" : "password"}
                  id="currentPassword"
                  {...register("currentPassword", {
                    required: "Current password is required",
                  })}
                  pt={{
                    root: {
                      className: `w-full px-4 py-3 pr-12 text-sm bg-white dark:bg-gray-900 border ${
                        errors.currentPassword
                          ? "border-red-300 dark:border-red-700 focus:border-red-500 dark:focus:border-red-400"
                          : "border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400"
                      } rounded-lg transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400`,
                    },
                  }}
                  placeholder="Enter current password"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  <Icon
                    icon={showCurrentPassword ? "mdi:eye-off" : "mdi:eye"}
                    className="w-5 h-5"
                  />
                </button>
              </div>
              {errors.currentPassword && (
                <p className="text-xs text-red-500 dark:text-red-400 flex items-center gap-1">
                  <Icon icon="mdi:alert-circle" className="w-3 h-3" />
                  {errors.currentPassword.message}
                </p>
              )}
            </div>

            {/* New Password */}
            <div className="space-y-2">
              <label
                htmlFor="newPassword"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                New Password *
              </label>
              <div className="relative">
                <InputText
                  type={showNewPassword ? "text" : "password"}
                  id="newPassword"
                  {...register("newPassword", {
                    required: "New password is required",
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters long",
                    },
                  })}
                  pt={{
                    root: {
                      className: `w-full px-4 py-3 pr-12 text-sm bg-white dark:bg-gray-900 border ${
                        errors.newPassword
                          ? "border-red-300 dark:border-red-700 focus:border-red-500 dark:focus:border-red-400"
                          : "border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400"
                      } rounded-lg transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400`,
                    },
                  }}
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  <Icon
                    icon={showNewPassword ? "mdi:eye-off" : "mdi:eye"}
                    className="w-5 h-5"
                  />
                </button>
              </div>
              {errors.newPassword && (
                <p className="text-xs text-red-500 dark:text-red-400 flex items-center gap-1">
                  <Icon icon="mdi:alert-circle" className="w-3 h-3" />
                  {errors.newPassword.message}
                </p>
              )}

              {/* Password Strength Indicator */}
              {newPassword && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Password Strength
                    </span>
                    <span
                      className={`text-xs font-medium ${
                        passwordStrength.strength <= 2
                          ? "text-red-500"
                          : passwordStrength.strength <= 3
                          ? "text-yellow-500"
                          : "text-green-500"
                      }`}
                    >
                      {passwordStrength.label}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                      style={{
                        width: `${(passwordStrength.strength / 5) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Confirm New Password */}
            <div className="space-y-2">
              <label
                htmlFor="confirmNewPassword"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Confirm New Password *
              </label>
              <div className="relative">
                <InputText
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmNewPassword"
                  {...register("confirmNewPassword", {
                    required: "Please confirm your new password",
                    validate: (value) =>
                      value === newPassword || "Passwords do not match",
                  })}
                  pt={{
                    root: {
                      className: `w-full px-4 py-3 pr-12 text-sm bg-white dark:bg-gray-900 border ${
                        errors.confirmNewPassword
                          ? "border-red-300 dark:border-red-700 focus:border-red-500 dark:focus:border-red-400"
                          : "border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400"
                      } rounded-lg transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400`,
                    },
                  }}
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  <Icon
                    icon={showConfirmPassword ? "mdi:eye-off" : "mdi:eye"}
                    className="w-5 h-5"
                  />
                </button>
              </div>
              {errors.confirmNewPassword && (
                <p className="text-xs text-red-500 dark:text-red-400 flex items-center gap-1">
                  <Icon icon="mdi:alert-circle" className="w-3 h-3" />
                  {errors.confirmNewPassword.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Password Requirements */}
        <div className="bg-blue-50/50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200/50 dark:border-blue-800/50">
          <h5 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2 flex items-center gap-2">
            <Icon icon="mdi:information" className="w-4 h-4" />
            Password Requirements
          </h5>
          <ul className="text-xs text-blue-800 dark:text-blue-200 space-y-1">
            <li className="flex items-center gap-2">
              <Icon icon="mdi:check-circle" className="w-3 h-3" />
              At least 8 characters long
            </li>
            <li className="flex items-center gap-2">
              <Icon icon="mdi:check-circle" className="w-3 h-3" />
              Mix of uppercase and lowercase letters
            </li>
            <li className="flex items-center gap-2">
              <Icon icon="mdi:check-circle" className="w-3 h-3" />
              At least one number
            </li>
            <li className="flex items-center gap-2">
              <Icon icon="mdi:check-circle" className="w-3 h-3" />
              At least one special character
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
                className: `px-8 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 disabled:from-gray-400 disabled:to-gray-500 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100 shadow-lg hover:shadow-xl disabled:shadow-none flex items-center gap-2 min-w-36 justify-center ${
                  isSubmitting ? "cursor-not-allowed" : "cursor-pointer"
                }`,
              },
            }}
          >
            {isSubmitting ? (
              <>
                <Icon icon="mdi:loading" className="w-4 h-4 animate-spin" />
                <span>Updating...</span>
              </>
            ) : (
              <>
                <Icon icon="mdi:shield-check" className="w-4 h-4" />
                <span>Update Password</span>
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Password;
