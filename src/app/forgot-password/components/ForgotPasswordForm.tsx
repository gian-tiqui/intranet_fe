"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Icon } from "@iconify/react/dist/iconify.js";
import MotionP from "@/app/components/animation/MotionP";
import useLogoutArtStore from "@/app/store/useLogoutSplashStore";
import { toast } from "react-toastify";
import apiClient from "@/app/http-common/apiUrl";
import { toastClass } from "@/app/tailwind-classes/tw_classes";
import Link from "next/link";
import { API_BASE } from "@/app/bindings/binding";
import { questions } from "@/app/utils/misc/questions";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { motion } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  Lock,
  User,
  HelpCircle,
  Eye,
  EyeOff,
  Mail,
  MapPin,
  Phone,
  Shield,
} from "lucide-react";
import ModernNav from "@/app/welcome/components/ModernNav";

type FormFields = {
  employeeId: number;
  answer: string;
  newPassword: string;
  secretQuestion1: string;
};

const ForgotPasswordForm = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [focusedField, setFocusedField] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const { showLogoutArt, setShowLogoutArt } = useLogoutArtStore();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormFields>();
  const [question, setQuestion] = useState<string>("");

  useEffect(() => {
    setIsLoaded(true);
    const timeout = setTimeout(() => {
      setShowLogoutArt(false);
    }, 3000);

    return () => clearTimeout(timeout);
  }, [showLogoutArt, setShowLogoutArt]);

  // Animation styles for floating elements
  const getAnimationStyle = (index: number) => ({
    animation: `float ${6 + index}s ease-in-out infinite`,
    animationDelay: `${index * 2}s`,
  });

  const handleForgotPassword = async ({
    employeeId,
    answer,
    newPassword,
    secretQuestion1,
  }: FormFields) => {
    try {
      setLoading(true);

      const response = await apiClient.post(
        `${API_BASE}/auth/forgot-password?employeeId=${employeeId}&answer=${answer}&newPassword=${newPassword}&secretQuestion1=${secretQuestion1}`
      );

      if (response.status === 201) {
        toast("Password reset successfully", {
          className: toastClass,
          type: "success",
        });
      }
    } catch (error: unknown) {
      const {
        response: {
          data: { message },
        },
      } = error as {
        response: { data: { message: string } };
      };
      if (typeof error === "object" && error !== null) {
        toast(message, {
          type: "error",
          className: toastClass,
        });
      } else {
        console.error("Unexpected error:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          33% {
            transform: translateY(-20px) rotate(1deg);
          }
          66% {
            transform: translateY(-10px) rotate(-1deg);
          }
        }
      `}</style>

      <div className="h-screen bg-gradient-to-br overflow-x-hidden from-slate-50 via-blue-50 to-cyan-50 overflow-auto">
        {/* Background animation */}
        <div className="fixed inset-0 pointer-events-none">
          <div
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl"
            style={getAnimationStyle(0)}
          />
          <div
            className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"
            style={getAnimationStyle(1)}
          />
          <div
            className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-r from-emerald-400/15 to-teal-400/15 rounded-full blur-3xl"
            style={getAnimationStyle(2)}
          />
        </div>

        {/* Header */}
        <ModernNav />

        {/* Main Content */}
        <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-200px)] p-6">
          <div className="w-full max-w-lg">
            <div
              style={{
                opacity: isLoaded ? 1 : 0,
                transform: `translateY(${isLoaded ? 0 : 30}px)`,
                transition: "all 0.8s ease-out 0.2s",
              }}
            >
              {/* Back Button */}
              <Link
                href="/login"
                className="group flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors duration-200 mb-8"
              >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" />
                <span className="font-semibold">Back to Login</span>
              </Link>

              {/* Header */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl mb-6 shadow-lg">
                  <Lock className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Recover your password
                </h2>
                <p className="text-gray-600">
                  Enter your details and security question to reset your
                  password
                </p>
              </div>

              {/* Form Container */}
              <div className="bg-white/60 backdrop-blur-md border border-white/20 rounded-3xl p-8 shadow-2xl">
                <div className="space-y-6">
                  {/* Employee ID Field */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">
                      Employee ID
                    </label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                        <User
                          className={`w-5 h-5 transition-colors duration-200 ${
                            focusedField === "employeeId"
                              ? "text-blue-600"
                              : "text-gray-400"
                          }`}
                        />
                      </div>
                      <InputText
                        {...register("employeeId", {
                          required: "Your id is required",
                        })}
                        placeholder="Enter your employee ID"
                        onFocus={() => setFocusedField("employeeId")}
                        onBlur={() => setFocusedField("")}
                        className="w-full h-14 pl-12 pr-4 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:bg-white transition-all duration-200"
                        style={{
                          border:
                            focusedField === "employeeId"
                              ? "2px solid #3b82f6"
                              : "1px solid #e5e7eb",
                          fontSize: "16px",
                        }}
                      />
                    </div>
                    {errors.employeeId && (
                      <MotionP className="text-red-500 text-sm font-semibold">
                        {errors.employeeId?.message}
                      </MotionP>
                    )}
                  </div>

                  {/* Security Question Dropdown */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">
                      Security Question
                    </label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                        <HelpCircle
                          className={`w-5 h-5 transition-colors duration-200 ${
                            focusedField === "secretQuestion"
                              ? "text-blue-600"
                              : "text-gray-400"
                          }`}
                        />
                      </div>
                      <Dropdown
                        options={questions}
                        placeholder="Select a security question"
                        value={question}
                        onChange={(e) => {
                          setQuestion(e.value);
                          setValue("secretQuestion1", e.value);
                        }}
                        onFocus={() => setFocusedField("secretQuestion")}
                        onBlur={() => setFocusedField("")}
                        className="w-full h-14 pl-12 pr-4 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-blue-500 focus:bg-white transition-all duration-200"
                        panelClassName="bg-white/95 backdrop-blur-md border border-white/20 rounded-xl shadow-2xl"
                        style={{
                          border:
                            focusedField === "secretQuestion"
                              ? "2px solid #3b82f6"
                              : "1px solid #e5e7eb",
                        }}
                      />
                    </div>
                    {errors.secretQuestion1 && (
                      <MotionP className="text-red-500 text-sm font-semibold">
                        Security question is required
                      </MotionP>
                    )}
                  </div>

                  {/* Answer Field */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">
                      Your Answer
                    </label>
                    <div className="relative">
                      <InputText
                        {...register("answer", {
                          required: "Your answer is required",
                        })}
                        placeholder="Enter your answer"
                        onFocus={() => setFocusedField("answer")}
                        onBlur={() => setFocusedField("")}
                        className="w-full h-14 px-4 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:bg-white transition-all duration-200"
                        style={{
                          border:
                            focusedField === "answer"
                              ? "2px solid #3b82f6"
                              : "1px solid #e5e7eb",
                          fontSize: "16px",
                        }}
                      />
                    </div>
                    {errors.answer && (
                      <MotionP className="text-red-500 text-sm font-semibold">
                        {errors.answer?.message}
                      </MotionP>
                    )}
                  </div>

                  {/* New Password Field */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">
                      New Password
                    </label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                        <Lock
                          className={`w-5 h-5 transition-colors duration-200 ${
                            focusedField === "newPassword"
                              ? "text-blue-600"
                              : "text-gray-400"
                          }`}
                        />
                      </div>
                      <InputText
                        {...register("newPassword", {
                          required: "New password is required",
                        })}
                        placeholder="Enter your new password"
                        type={showNewPassword ? "text" : "password"}
                        onFocus={() => setFocusedField("newPassword")}
                        onBlur={() => setFocusedField("")}
                        className="w-full h-14 pl-12 pr-12 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:bg-white transition-all duration-200"
                        style={{
                          border:
                            focusedField === "newPassword"
                              ? "2px solid #3b82f6"
                              : "1px solid #e5e7eb",
                          fontSize: "16px",
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors duration-200"
                      >
                        {showNewPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    {errors.newPassword && (
                      <MotionP className="text-red-500 text-sm font-semibold">
                        {errors.newPassword?.message ||
                          "New password is required"}
                      </MotionP>
                    )}
                  </div>

                  {/* Submit Button */}
                  <Button
                    onClick={handleSubmit(handleForgotPassword)}
                    disabled={loading}
                    className="group w-full h-14 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 disabled:opacity-70 disabled:cursor-not-allowed rounded-xl font-semibold text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 border-none"
                  >
                    {loading ? (
                      <Icon icon="line-md:loading-loop" className="w-6 h-6" />
                    ) : (
                      <>
                        Recover Password
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                      </>
                    )}
                  </Button>

                  {/* Back to Login Link */}
                  <div className="text-center pt-4">
                    <p className="text-gray-600 text-sm">
                      Remembered your password?{" "}
                      <Link
                        href="/login"
                        className="text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200 font-semibold"
                      >
                        Sign in here
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <motion.footer
          className="relative z-10 text-center py-8 mt-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          <div className="flex items-center justify-center space-x-2 text-gray-600">
            <Shield className="w-4 h-4" />
            <span>Powered by Westlake Medical Center ICT Department</span>
          </div>
          <div className="flex justify-center items-center space-x-6 mt-4">
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Phone className="w-4 h-4" />
              <span>(+632) 8553-8185</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Mail className="w-4 h-4" />
              <span>info@westlakemedical.com</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <MapPin className="w-4 h-4" />
              <span>San Pedro, Laguna</span>
            </div>
          </div>
        </motion.footer>
      </div>
    </>
  );
};

export default ForgotPasswordForm;
