"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  Eye,
  EyeOff,
  Lock,
  User,
  ArrowRight,
  Shield,
  Phone,
  MapPin,
  AlertCircle,
} from "lucide-react";
import { API_BASE, INTRANET } from "@/app/bindings/binding";
import axios from "axios";
import { Image as PrimeImage } from "primereact/image";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import { Toast } from "primereact/toast";
import Cookies from "js-cookie";
import useLoginStore from "@/app/store/loggedInStore";
import wmcLogo from "@/app/assets/westlake_logo_horizontal.jpg.png";

// Type definitions
interface FormFields {
  employeeId: string;
  password: string;
}

interface FormData {
  employeeId: string;
  password: string;
}

interface FormErrors {
  employeeId?: string;
  password?: string;
}

interface FormFields {
  employeeId: string;
  password: string;
}

interface FormData {
  employeeId: string;
  password: string;
}

interface FormErrors {
  employeeId?: string;
  password?: string;
}

interface LoginResponse {
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}

interface DecodedToken {
  confirmed: boolean;
  exp?: number;
}

const ModernLoginPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const { setIsLoggedIn } = useLoginStore();
  const [formData, setFormData] = useState<FormData>({
    employeeId: "",
    password: "",
  });
  const router = useRouter();
  const [, setWrongAttempts] = useState<number>(0);
  const [errors, setErrors] = useState<FormErrors>({});
  const [focusedField, setFocusedField] = useState<string>("");
  const toastRef = useRef<Toast>(null);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleLogin = async ({
    employeeId,
    password,
  }: FormFields): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await axios.post<LoginResponse>(
        `${API_BASE}/auth/login`,
        {
          employeeId,
          password,
        }
      );

      // Remove toast.dismiss(); -- not needed for PrimeReact Toast

      const accessToken: DecodedToken = jwtDecode(
        response.data.tokens.accessToken
      );

      if (accessToken.confirmed === false) {
        toastRef.current?.show({
          severity: "info",
          summary: "Account not active",
          detail: "Please wait for your account to be activated",
          life: 4000,
        });
        return;
      }

      const rt = response.data.tokens.refreshToken;
      const decodedToken = jwtDecode<{ exp?: number }>(rt);

      const expiresInSeconds = decodedToken.exp
        ? decodedToken.exp - Math.floor(Date.now() / 1000)
        : 0;
      const expirationDays = Math.max(
        Math.floor(expiresInSeconds / (24 * 60 * 60)),
        1
      );

      Cookies.set(INTRANET, rt, { expires: expirationDays });
      localStorage.setItem(INTRANET, response.data.tokens.accessToken);

      setIsLoggedIn(true);
      router.push("/");
    } catch (error: unknown) {
      console.error(error);
      if (typeof error === "object" && error !== null) {
        toastRef.current?.show({
          severity: "error",
          summary: "Login Failed",
          detail: "There's a problem with your ID or password",
          life: 4000,
        });
        setWrongAttempts((prev) => prev + 1);
      } else {
        console.error("Unexpected error:", error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>
  ): Promise<void> => {
    e.preventDefault();

    // Basic validation
    const newErrors: FormErrors = {};
    if (!formData.employeeId.trim()) {
      newErrors.employeeId = "Employee ID is required";
    }
    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    await handleLogin(formData);
  };

  const handleInputChange = (field: keyof FormData, value: string): void => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-100 via-blue-50 to-cyan-100">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating Geometric Shapes */}
        <div className="absolute w-32 h-32 rounded-full top-20 left-10 bg-gradient-to-r from-blue-400/10 to-cyan-400/10 blur-xl animate-pulse"></div>
        <div
          className="absolute w-24 h-24 rounded-lg top-40 right-20 bg-gradient-to-r from-purple-400/10 to-pink-400/10 blur-lg animate-bounce"
          style={{ animationDuration: "3s" }}
        ></div>
        <div
          className="absolute w-20 h-20 rounded-full bottom-32 left-20 bg-gradient-to-r from-green-400/10 to-blue-400/10 blur-lg animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute rounded-lg bottom-20 right-10 w-28 h-28 bg-gradient-to-r from-yellow-400/10 to-orange-400/10 blur-xl animate-bounce"
          style={{ animationDuration: "4s", animationDelay: "2s" }}
        ></div>

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_2px,transparent_2px),linear-gradient(90deg,rgba(59,130,246,0.03)_2px,transparent_2px)] bg-[size:4rem_4rem]"></div>
      </div>

      {/* Centered Content */}
      <div className="flex items-center justify-center min-h-screen p-4">
        <div
          className="w-full max-w-md"
          style={{
            opacity: isLoaded ? 1 : 0,
            transform: `translateY(${isLoaded ? 0 : 20}px)`,
            transition: "all 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          {/* Login Card */}
          <div className="relative p-8 border shadow-2xl bg-white/70 backdrop-blur-xl rounded-3xl border-white/20 lg:p-10">
            {/* Floating Header */}
            <div className="mb-8 text-center">
              {/* Logo Container */}
              <div
                onClick={() => router.push("welcome")}
                className="inline-flex items-center justify-center w-14 h-14 mb-6 transition-transform duration-300 transform shadow-xl hover:scale-105"
              >
                <PrimeImage src={wmcLogo.src} alt="Westlake Medical Center" />
              </div>

              {/* Welcome Text */}
              <div className="space-y-2">
                <h1 className="text-3xl font-bold text-transparent lg:text-4xl bg-gradient-to-r from-gray-900 via-blue-800 to-cyan-700 bg-clip-text">
                  Welcome Back
                </h1>
                <p className="font-medium text-gray-600">WMC Employee Portal</p>
                <div className="w-16 h-1 mx-auto rounded-full bg-gradient-to-r from-blue-500 to-cyan-500"></div>
              </div>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Employee ID Field */}
              <div className="space-y-2">
                <label className="block mb-2 text-sm font-semibold text-gray-700">
                  Employee ID
                </label>
                <div className="relative group">
                  <div className="absolute transition-all duration-300 transform -translate-y-1/2 left-4 top-1/2">
                    <User
                      className={`w-5 h-5 ${
                        focusedField === "employeeId"
                          ? "text-blue-600 scale-110"
                          : "text-gray-400"
                      }`}
                    />
                  </div>
                  <input
                    type="text"
                    value={formData.employeeId}
                    onChange={(e) =>
                      handleInputChange("employeeId", e.target.value)
                    }
                    onFocus={() => setFocusedField("employeeId")}
                    onBlur={() => setFocusedField("")}
                    placeholder="Enter your employee ID"
                    className={`w-full pl-12 pr-4 h-14 bg-white/60 backdrop-blur-sm border-2 rounded-xl 
                      placeholder-gray-500 text-gray-900 font-medium transition-all duration-300
                      focus:outline-none focus:bg-white focus:border-blue-500 focus:shadow-lg focus:shadow-blue-500/20
                      hover:bg-white/80 hover:border-gray-300
                      ${
                        errors.employeeId ? "border-red-300" : "border-gray-200"
                      }
                    `}
                  />
                </div>
                {errors.employeeId && (
                  <div className="flex items-center gap-2 text-sm font-medium text-red-500 animate-pulse">
                    <AlertCircle className="w-4 h-4" />
                    {errors.employeeId}
                  </div>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label className="block mb-2 text-sm font-semibold text-gray-700">
                  Password
                </label>
                <div className="relative group">
                  <div className="absolute transition-all duration-300 transform -translate-y-1/2 left-4 top-1/2">
                    <Lock
                      className={`w-5 h-5 ${
                        focusedField === "password"
                          ? "text-blue-600 scale-110"
                          : "text-gray-400"
                      }`}
                    />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) =>
                      handleInputChange("password", e.target.value)
                    }
                    onFocus={() => setFocusedField("password")}
                    onBlur={() => setFocusedField("")}
                    placeholder="Enter your password"
                    className={`w-full pl-12 pr-12 h-14 bg-white/60 backdrop-blur-sm border-2 rounded-xl 
                      placeholder-gray-500 text-gray-900 font-medium transition-all duration-300
                      focus:outline-none focus:bg-white focus:border-blue-500 focus:shadow-lg focus:shadow-blue-500/20
                      hover:bg-white/80 hover:border-gray-300
                      ${errors.password ? "border-red-300" : "border-gray-200"}
                    `}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute text-gray-400 transition-all duration-300 transform -translate-y-1/2 right-4 top-1/2 hover:text-blue-600 hover:scale-110"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <div className="flex items-center gap-2 text-sm font-medium text-red-500 animate-pulse">
                    <AlertCircle className="w-4 h-4" />
                    {errors.password}
                  </div>
                )}
              </div>

              {/* Sign In Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-14 bg-gradient-to-r from-blue-600 via-blue-700 to-cyan-600 
                    hover:from-blue-700 hover:via-blue-800 hover:to-cyan-700
                    disabled:opacity-60 disabled:cursor-not-allowed
                    rounded-xl font-bold text-white text-lg shadow-xl
                    transform hover:scale-[1.02] active:scale-[0.98] 
                    transition-all duration-300 ease-out
                    hover:shadow-2xl hover:shadow-blue-500/30
                    flex items-center justify-center gap-3 group"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 border-2 rounded-full border-white/30 border-t-white animate-spin"></div>
                      <span>Signing in...</span>
                    </div>
                  ) : (
                    <>
                      <span>Sign In</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                    </>
                  )}
                </button>
              </div>

              {/* Forgot Password */}
              <div className="pt-4 text-center">
                <button
                  onClick={() => router.push("forgot-password")}
                  type="button"
                  className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 transition-all duration-300 hover:text-blue-800 hover:underline group"
                >
                  <AlertCircle className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                  Forgot your password?
                </button>
              </div>
            </form>
          </div>

          {/* Footer Info */}
          <div className="mt-8 space-y-3 text-center">
            <div className="flex items-center justify-center gap-2 text-gray-600">
              <Shield className="w-4 h-4" />
              <span className="text-sm font-medium">
                Westlake Medical Center ICT Department
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <Phone className="w-3 h-3" />
                <span>(+632) 8553-8185</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                <span>San Pedro, Laguna</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernLoginPage;
