"use client";
import React, { useState, useEffect, MouseEvent } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import {
  ChevronRight,
  Users,
  Award,
  Heart,
  Shield,
  ArrowRight,
  Phone,
  Mail,
  MapPin,
  Activity,
  FileText,
  LucideIcon,
} from "lucide-react";
import ModernNav from "./ModernNav";
import { useQuery } from "@tanstack/react-query";
import { getLandingPageData } from "@/app/utils/service/landingPageService";

// === Types ===
interface Department {
  title: string;
  subtitle: string;
  description: string;
  icon: LucideIcon;
  color: string;
  image: string;
}

interface Stat {
  label: string;
  value: string | undefined;
  icon: LucideIcon;
}

interface CardItem {
  icon: LucideIcon;
  label: string;
  value: string | undefined;
  color: string;
}

interface MousePosition {
  x: number;
  y: number;
}

// === Component ===
const ModernMedicalLanding: React.FC = () => {
  const { data } = useQuery({
    queryKey: [`landing-page-data`],
    queryFn: () => getLandingPageData(),
  });

  const [showNotice, setShowNotice] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<number>(0);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [mousePosition, setMousePosition] = useState<MousePosition>({
    x: 0,
    y: 0,
  });

  // === Variants ===
  const heroVariants: Variants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 1.2, ease: "easeOut" },
    },
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.3 + i * 0.2,
        duration: 0.8,
        ease: "easeOut",
      },
    }),
  };

  // === Data ===
  const departments: Department[] = [
    {
      title: "Human Resources",
      subtitle: "Manage People & Policies",
      description:
        "Access forms, track employee memos, and stay informed with HR updates.",
      icon: Users,
      color: "from-blue-500 to-cyan-500",
      image: "📄",
    },
    {
      title: "Quality Management",
      subtitle: "Maintain Standards",
      description:
        "Review quality metrics, audit results, and compliance announcements.",
      icon: Award,
      color: "from-purple-500 to-pink-500",
      image: "📊",
    },
    {
      title: "Departmental Memos",
      subtitle: "Stay Informed",
      description:
        "Get real-time updates from your department and organization-wide announcements.",
      icon: FileText,
      color: "from-green-500 to-emerald-500",
      image: "🗂️",
    },
  ];

  const stats: Stat[] = [
    {
      label: "Employees",
      value: data?.data.employeesCount.toString(),
      icon: Users,
    },
    { label: "Patients Served", value: "10K+", icon: Heart },
    { label: "Years of Excellence", value: "13", icon: Award },
    { label: "Regular Consultants", value: "100+", icon: Activity },
  ];

  const additionalCards: CardItem[] = [
    {
      icon: FileText,
      label: "Memos Shared",
      value: data?.data.postsCount.toString(),
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: Activity,
      label: "Notifications Sent",
      value: data?.data.notificationsCount.toString(),
      color: "from-purple-500 to-pink-500",
    },
  ];

  // === Effects ===
  useEffect(() => {
    setIsLoaded(true);

    const interval = setInterval(() => {
      setActiveTab((prev) => (prev + 1) % departments.length);
    }, 4000);

    const handleMouseMove = (e: MouseEvent | globalThis.MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      clearInterval(interval);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [departments.length]);

  // === JSX ===
  return (
    <div className="h-screen bg-gradient-to-br overflow-x-hidden from-slate-50 via-blue-50 to-cyan-50 overflow-auto">
      {/* Background animation */}
      {showNotice && (
        <div className="fixed inset-0 flex items-center justify-center bg-white/10 backdrop-blur-md z-50">
          <div className="bg-white/30 border border-white/40 backdrop-blur-lg p-10 rounded-2xl shadow-2xl max-w-lg w-[90%] text-center text-blue-600">
            <h2 className="text-3xl font-bold mb-4 tracking-tight">
              Welcome to the Westlake Employee Portal
            </h2>
            <p className="text-lg font-medium text-gray-700/80 mb-6">
              This portal is strictly for authorized employees of Westlake
              Medical Center . If you are not affiliated, please refrain from
              using this platform.
            </p>
            <button
              className="bg-blue-600/80 hover:bg-blue-600/100 hover:scale-110 text-white font-semibold px-6 py-3 rounded-full transition-all backdrop-blur-md border border-white/50"
              onClick={() => setShowNotice(false)}
            >
              I Understand
            </button>
          </div>
        </div>
      )}
      <div className="fixed inset-0 pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl"
          animate={{
            x: mousePosition.x * 0.02,
            y: mousePosition.y * 0.02,
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"
          animate={{
            x: -mousePosition.x * 0.02,
            y: -mousePosition.y * 0.02,
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Navigation */}
      <ModernNav />

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side */}
          <motion.div
            variants={heroVariants}
            initial="hidden"
            animate={isLoaded ? "visible" : "hidden"}
            className="space-y-8"
          >
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              <span className="inline-block px-4 py-2 bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 rounded-full text-sm font-semibold mb-4">
                🏥 Memos Directory Portal
              </span>
              <h2 className="text-5xl lg:text-7xl font-bold text-gray-900 leading-tight">
                Your{" "}
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
                  Workday
                </span>{" "}
                Starts here
              </h2>
            </motion.div>

            <motion.p
              className="text-xl text-gray-600 max-w-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              Connect with departments, view memos, manage documents, and
              collaborate seamlessly within the organization.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              <motion.button
                className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-lg flex items-center justify-center space-x-3"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>Get Started</span>
                <ChevronRight className="w-5 h-5" />
              </motion.button>

              <motion.button
                className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-2xl font-semibold text-lg hover:border-blue-500 hover:text-blue-600 flex items-center justify-center space-x-3"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Phone className="w-5 h-5" />
                <span>Contact Us</span>
              </motion.button>
            </motion.div>

            {/* Stats */}
            <motion.div
              className="grid grid-cols-2 gap-6 pt-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
            >
              {stats.map((stat) => (
                <motion.div
                  key={stat.label}
                  className="flex items-center space-x-3"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl flex items-center justify-center">
                    <stat.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Side: Department Cards */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 1 }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, scale: 0.9, rotateY: 15 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                exit={{ opacity: 0, scale: 0.9, rotateY: -15 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                <div
                  className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${departments[activeTab].color} p-8 shadow-2xl`}
                >
                  <div className="absolute inset-0 bg-white/10 backdrop-blur-sm rounded-3xl"></div>

                  <div className="relative z-10 text-white">
                    <div className="text-6xl mb-6">
                      {departments[activeTab].image}
                    </div>
                    <h3 className="text-2xl font-bold mb-2">
                      {departments[activeTab].title}
                    </h3>
                    <p className="text-white/90 text-sm mb-4">
                      {departments[activeTab].subtitle}
                    </p>
                    <p className="text-white/80 leading-relaxed mb-6">
                      {departments[activeTab].description}
                    </p>
                    <motion.button
                      className="bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-full font-semibold flex items-center space-x-2 hover:bg-white/30"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span>Learn More</span>
                      <ArrowRight className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Tab indicators */}
            <div className="flex justify-center space-x-3">
              {departments.map((_, index) => (
                <motion.button
                  key={index}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === activeTab
                      ? "bg-blue-600 scale-125"
                      : "bg-gray-300"
                  }`}
                  onClick={() => setActiveTab(index)}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                />
              ))}
            </div>

            {/* Additional Cards */}
            <div className="grid grid-cols-2 gap-4">
              {additionalCards.map((item, index) => (
                <motion.div
                  key={item.label}
                  className={`bg-gradient-to-br ${item.color} rounded-2xl p-6 text-white shadow-lg`}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  custom={index}
                  whileHover={{ scale: 1.05, rotateY: 5 }}
                >
                  <item.icon className="w-8 h-8 mb-3 opacity-80" />
                  <div className="text-2xl font-bold mb-1">{item.value}</div>
                  <div className="text-white/90 text-sm">{item.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
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
  );
};

export default ModernMedicalLanding;
