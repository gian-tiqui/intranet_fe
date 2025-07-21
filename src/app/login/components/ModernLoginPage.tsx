"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  Eye,
  EyeOff,
  Building2,
  Lock,
  User,
  ArrowRight,
  Shield,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { API_BASE, INTRANET } from "@/app/bindings/binding";
import useLoginStore from "@/app/store/loggedInStore";
import { Toast } from "primereact/toast";

// Type definitions
interface MousePosition {
  x: number;
  y: number;
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
  const router = useRouter();
  const { setIsLoggedIn } = useLoginStore();
  const toastRef = useRef<Toast>(null);

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [mousePosition, setMousePosition] = useState<MousePosition>({
    x: 0,
    y: 0,
  });
  const [animationTime, setAnimationTime] = useState<number>(0);
  const [, setWrongAttempts] = useState<number>(0);
  const [formData, setFormData] = useState<FormData>({
    employeeId: "",
    password: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [focusedField, setFocusedField] = useState<string>("");

  useEffect(() => {
    // Prevent hydration mismatch by setting initial state after mount
    setIsLoaded(true);
    setAnimationTime(Date.now());

    const handleMouseMove = (e: MouseEvent): void => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    // Animation loop for smooth background animation
    const animationInterval = setInterval(() => {
      setAnimationTime(Date.now());
    }, 50);

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      clearInterval(animationInterval);
    };
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

  // Calculate animation values only on client side
  const getAnimationStyle = (index: number = 0): React.CSSProperties => {
    if (!isLoaded) return {};

    return {
      transform: `translate(${
        mousePosition.x * (index === 0 ? 0.02 : -0.02)
      }px, ${mousePosition.y * (index === 0 ? 0.02 : -0.02)}px) scale(${
        1 + Math.sin(animationTime / (3000 + index * 1000)) * 0.1
      })`,
      transition: "transform 0.1s ease-out",
    };
  };

  return (
    <div className="h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 flex items-center justify-center p-4 overflow-hidden">
      <style
        dangerouslySetInnerHTML={{
          __html: `
          @keyframes float {
            0%, 100% { transform: translate(0, 0) rotate(0deg); }
            33% { transform: translate(15px, -15px) rotate(1deg); }
            66% { transform: translate(-10px, 10px) rotate(-1deg); }
          }
        `,
        }}
      />

      {/* Background animation */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-1/4 left-1/6 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl"
          style={getAnimationStyle(0)}
        />
        <div
          className="absolute bottom-1/4 right-1/6 w-80 h-80 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"
          style={getAnimationStyle(1)}
        />
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-r from-indigo-400/15 to-cyan-400/15 rounded-full blur-3xl"
          style={getAnimationStyle(2)}
        />
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 w-full max-w-md flex flex-col justify-center min-h-0">
        {/* Header Section */}
        <div
          className="text-center mb-4"
          style={{
            opacity: isLoaded ? 1 : 0,
            transform: `translateY(${isLoaded ? 0 : -30}px)`,
            transition: "all 0.8s ease-out",
          }}
        >
          {/* Logo */}
          <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl mb-3 shadow-lg">
            <Building2 className="w-6 h-6 text-white" />
          </div>

          {/* Title */}
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight mb-2">
            Hospital at the{" "}
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
              Heart of Laguna
            </span>
          </h1>

          {/* Badge */}
          <span className="inline-block px-3 py-1 bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 rounded-full text-xs font-semibold">
            🏥 Employee Portal Access
          </span>
        </div>

        {/* Login Form */}
        <div
          className="bg-white/70 backdrop-blur-xl border border-white/30 rounded-2xl p-5 shadow-2xl"
          style={{
            opacity: isLoaded ? 1 : 0,
            transform: `translateY(${isLoaded ? 0 : 30}px)`,
            transition: "all 0.8s ease-out 0.2s",
          }}
        >
          {/* Form Header */}
          <div className="text-center mb-4">
            <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-1">
              Welcome back
            </h2>
            <p className="text-xs text-gray-600">
              Sign in to your Westlake Medical Center account
            </p>
          </div>

          {/* Form */}
          <div className="space-y-4">
            {/* Employee ID Field */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-700">
                Employee ID
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <User
                    className={`w-4 h-4 transition-colors duration-200 ${
                      focusedField === "employeeId"
                        ? "text-blue-600"
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
                  className="w-full h-12 pl-10 pr-3 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 text-sm focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                />
              </div>
              {errors.employeeId && (
                <p className="text-red-500 text-xs font-semibold">
                  {errors.employeeId}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-700">
                Password
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <Lock
                    className={`w-4 h-4 transition-colors duration-200 ${
                      focusedField === "password"
                        ? "text-blue-600"
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
                  className="w-full h-12 pl-10 pr-10 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 text-sm focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors duration-200"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs font-semibold">
                  {errors.password}
                </p>
              )}
            </div>

            {/* Sign In Button */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              className="group w-full h-12 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:opacity-70 disabled:cursor-not-allowed rounded-xl font-semibold text-white text-sm shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                </>
              )}
            </button>

            {/* Forgot Password Link */}
            <div className="text-center pt-1">
              <button
                type="button"
                className="text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200 text-xs font-semibold"
              >
                Forgot your password?
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          className="text-center mt-4 space-y-2"
          style={{
            opacity: isLoaded ? 1 : 0,
            transform: `translateY(${isLoaded ? 0 : 30}px)`,
            transition: "all 0.8s ease-out 0.4s",
          }}
        >
          <div className="flex items-center justify-center space-x-1 text-gray-600">
            <Shield className="w-3 h-3" />
            <span className="text-xs">
              Powered by Westlake Medical Center ICT
            </span>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-3 text-xs text-gray-500">
            <div className="flex items-center space-x-1">
              <Phone className="w-2 h-2" />
              <span>(+632) 8553-8185</span>
            </div>
            <div className="flex items-center space-x-1">
              <Mail className="w-2 h-2" />
              <span>info@westlakemedical.com</span>
            </div>
            <div className="flex items-center space-x-1">
              <MapPin className="w-2 h-2" />
              <span>San Pedro, Laguna</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernLoginPage;
