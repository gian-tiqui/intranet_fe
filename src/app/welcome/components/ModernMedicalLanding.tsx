"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  Star,
  Activity,
  Calendar,
  FileText,
} from "lucide-react";

const ModernMedicalLanding = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setIsLoaded(true);

    // Tab rotation
    const interval = setInterval(() => {
      setActiveTab((prev) => (prev + 1) % 3);
    }, 4000);

    // Mouse tracking for subtle parallax
    const handleMouseMove = (e) => {
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
  }, []);

  const heroVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 1.2, ease: "easeOut" },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.3 + i * 0.2,
        duration: 0.8,
        ease: "easeOut",
      },
    }),
  };

  const departments = [
    {
      title: "HR Department",
      subtitle: "Human Resources Excellence",
      description:
        "Empowering our healthcare heroes with comprehensive support and development",
      icon: Users,
      color: "from-blue-500 to-cyan-500",
      image: "👥",
    },
    {
      title: "Quality Management",
      subtitle: "Excellence in Healthcare",
      description:
        "Ensuring the highest standards of patient care and safety protocols",
      icon: Award,
      color: "from-purple-500 to-pink-500",
      image: "🏆",
    },
    {
      title: "Patient Care",
      subtitle: "Compassionate Healthcare",
      description:
        "Delivering exceptional medical care with heart and dedication",
      icon: Heart,
      color: "from-green-500 to-emerald-500",
      image: "❤️",
    },
  ];

  const stats = [
    { label: "Healthcare Professionals", value: "500+", icon: Users },
    { label: "Patients Served", value: "25K+", icon: Heart },
    { label: "Years of Excellence", value: "15+", icon: Award },
    { label: "Success Rate", value: "98%", icon: Activity },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 overflow-hidden">
      {/* Animated Background Elements */}
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
      <motion.nav
        className="relative z-50 px-6 py-4"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <motion.div
            className="flex items-center space-x-4"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Westlake Medical Center
              </h1>
              <p className="text-sm text-gray-600">Employee Portal</p>
            </div>
          </motion.div>

          <div className="hidden md:flex items-center space-x-8">
            {["Home", "About", "Services", "Contact"].map((item, index) => (
              <motion.a
                key={item}
                href="#"
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                {item}
              </motion.a>
            ))}
          </div>

          <motion.button
            className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2"
            whileHover={{
              scale: 1.05,
              boxShadow: "0 20px 40px rgba(59, 130, 246, 0.3)",
            }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <span>Login</span>
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
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
                🏥 Healthcare Excellence Portal
              </span>
              <h2 className="text-5xl lg:text-7xl font-bold text-gray-900 leading-tight">
                Your{" "}
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
                  Healthcare
                </span>{" "}
                Journey Starts Here
              </h2>
            </motion.div>

            <motion.p
              className="text-xl text-gray-600 leading-relaxed max-w-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              Connect with our world-class medical professionals and access
              comprehensive healthcare services designed for your wellbeing.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              <motion.button
                className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-3"
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 25px 50px rgba(59, 130, 246, 0.4)",
                }}
                whileTap={{ scale: 0.95 }}
              >
                <span>Get Started</span>
                <ChevronRight className="w-5 h-5" />
              </motion.button>

              <motion.button
                className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-2xl font-semibold text-lg hover:border-blue-500 hover:text-blue-600 transition-all duration-300 flex items-center justify-center space-x-3"
                whileHover={{ scale: 1.05, borderColor: "#3b82f6" }}
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
              {stats.map((stat, index) => (
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

          {/* Right Content - Department Cards */}
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
                className="relative"
              >
                <div
                  className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${departments[activeTab].color} p-8 shadow-2xl hover:shadow-3xl transition-all duration-300`}
                >
                  {/* Glassmorphism effect */}
                  <div className="absolute inset-0 bg-white/10 backdrop-blur-sm rounded-3xl"></div>

                  <div className="relative z-10 text-white">
                    <div className="flex items-center justify-between mb-6">
                      <div className="text-6xl">
                        {departments[activeTab].image}
                      </div>
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
                      className="bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-full font-semibold flex items-center space-x-2 hover:bg-white/30 transition-all duration-300"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span>Learn More</span>
                      <ArrowRight className="w-4 h-4" />
                    </motion.button>
                  </div>

                  {/* Decorative elements */}
                  <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full"></div>
                  <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-white/5 rounded-full"></div>
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

            {/* Additional cards */}
            <div className="grid grid-cols-2 gap-4">
              {[
                {
                  icon: Calendar,
                  label: "Appointments",
                  value: "2.1k",
                  color: "from-green-500 to-emerald-500",
                },
                {
                  icon: FileText,
                  label: "Reports",
                  value: "850+",
                  color: "from-purple-500 to-pink-500",
                },
              ].map((item, index) => (
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
            <span>(02) 8123-4567</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Mail className="w-4 h-4" />
            <span>info@westlakemedical.com</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <MapPin className="w-4 h-4" />
            <span>Metro Manila, Philippines</span>
          </div>
        </div>
      </motion.footer>
    </div>
  );
};

export default ModernMedicalLanding;
