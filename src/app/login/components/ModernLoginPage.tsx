"use client";
import React, { useState, useEffect } from "react";
import {
  Eye,
  EyeOff,
  Building2,
  Lock,
  User,
  ArrowRight,
  Shield,
  LucideIcon,
} from "lucide-react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { API_BASE, INTRANET } from "@/app/bindings/binding";
import { toastClass } from "@/app/tailwind-classes/tw_classes";
import useLoginStore from "@/app/store/loggedInStore";
import ModernNav from "@/app/welcome/components/ModernNav";

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

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
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

      toast.dismiss();

      const accessToken: DecodedToken = jwtDecode(
        response.data.tokens.accessToken
      );

      if (accessToken.confirmed === false) {
        toast("Please wait for your account to be activated", {
          className: toastClass,
          type: "info",
        });
        return;
      }

      // setHidden(true); // Uncomment if you have this state
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

      setIsLoggedIn(true); // Uncomment if you have this state
      // setShowSplash(true); // Uncomment if you have this state
      // setIsCollapsed(false); // Uncomment if you have this state

      router.push("/");
    } catch (error: unknown) {
      console.error(error);
      if (typeof error === "object" && error !== null) {
        toast("There's a problem with your ID or password", {
          type: "error",
          className: toastClass,
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

  const features: Feature[] = [
    {
      icon: Shield,
      title: "Secure Access",
      description: "Advanced security protocols protect your medical data",
    },
    {
      icon: Building2,
      title: "Hospital Network",
      description: "Connected to all Westlake Medical Center systems",
    },
    {
      icon: User,
      title: "Personalized Dashboard",
      description: "Customized interface based on your role and department",
    },
  ];

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
    <div
      className={`h-screen bg-gradient-to-br  overflow-x-hidden from-slate-50 via-blue-50 to-cyan-50 overflow-auto`}
    >
      {/* Navbar */}
      <ModernNav />

      {/* Background animation */}
      <div className="fixed inset-0 pt pointer-events-none">
        <div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl"
          style={getAnimationStyle(0)}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"
          style={getAnimationStyle(1)}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 h-full flex pt-24">
        {/* Left Side - Hero Content */}
        <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12">
          <div
            className="space-y-8 max-w-lg"
            style={{
              opacity: isLoaded ? 1 : 0,
              transform: `translateY(${isLoaded ? 0 : 50}px)`,
              transition: "all 0.8s ease-out",
            }}
          >
            <div>
              <span className="inline-block px-4 py-2 bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 rounded-full text-sm font-semibold mb-4">
                🏥 Medical Portal Access
              </span>
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Hospital at the{" "}
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
                  Heart of Laguna
                </span>
              </h1>
            </div>

            <p className="text-xl text-gray-600">
              View department memos, guidelines, procedures and collaborate with
              your team.
            </p>

            {/* Feature Cards */}
            <div className="space-y-4">
              {features.map((feature, index) => (
                <div
                  key={feature.title}
                  className="flex items-start space-x-4 p-4 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20 hover:bg-white/80 transition-all duration-300"
                  style={{
                    opacity: isLoaded ? 1 : 0,
                    transform: `translateX(${isLoaded ? 0 : -30}px)`,
                    transition: `all 0.8s ease-out ${index * 0.1}s`,
                  }}
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Text */}
            <div className="pt-8">
              <h2 className="text-3xl font-bold text-gray-800">
                Centers of{" "}
                <span className="bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                  Excellence
                </span>
              </h2>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
          <div
            className="w-full max-w-md"
            style={{
              opacity: isLoaded ? 1 : 0,
              transform: `translateY(${isLoaded ? 0 : 30}px)`,
              transition: "all 0.8s ease-out 0.2s",
            }}
          >
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl mb-6 shadow-lg">
                <Building2 className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome back
              </h2>
              <p className="text-gray-600">
                Sign in to your Westlake Medical Center account
              </p>
            </div>

            {/* Form Container */}
            <div className="bg-white/60 backdrop-blur-md border border-white/20 rounded-3xl p-8 shadow-2xl">
              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
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
                    <input
                      type="text"
                      value={formData.employeeId}
                      onChange={(e) =>
                        handleInputChange("employeeId", e.target.value)
                      }
                      onFocus={() => setFocusedField("employeeId")}
                      onBlur={() => setFocusedField("")}
                      placeholder="Enter your employee ID"
                      className="w-full h-14 pl-12 pr-4 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:bg-white transition-all duration-200"
                    />
                  </div>
                  {errors.employeeId && (
                    <p className="text-red-500 text-sm font-semibold">
                      {errors.employeeId}
                    </p>
                  )}
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                      <Lock
                        className={`w-5 h-5 transition-colors duration-200 ${
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
                      className="w-full h-14 pl-12 pr-12 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:bg-white transition-all duration-200"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors duration-200"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-sm font-semibold">
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* Sign In Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="group w-full h-14 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:opacity-70 disabled:cursor-not-allowed rounded-xl font-semibold text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      Sign In
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                    </>
                  )}
                </button>

                {/* Forgot Password Link */}
                <div className="text-center">
                  <button
                    onClick={() => router.push("/forgot-password")}
                    type="button"
                    className="text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200 text-sm font-semibold"
                  >
                    Forgot your password?
                  </button>
                </div>
              </form>
            </div>

            {/* Mobile Hero Content */}
            <div className="lg:hidden mt-8 text-center">
              <span className="inline-block px-4 py-2 bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 rounded-full text-sm font-semibold mb-4">
                🏥 Medical Portal Access
              </span>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Hospital at the{" "}
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
                  Heart of Laguna
                </span>
              </h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernLoginPage;
