"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, HelpCircle, Shield } from "lucide-react";
import ModernNav from "@/app/welcome/components/ModernNav";

interface FAQ {
  question: string;
  answer: string;
  category: string;
  icon: string;
}

interface MousePosition {
  x: number;
  y: number;
}

const Faqs: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [mousePosition, setMousePosition] = useState<MousePosition>({
    x: 0,
    y: 0,
  });
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    setIsLoaded(true);

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const faqData: FAQ[] = [
    {
      question: "How do I access my employee portal account?",
      answer:
        "You can access your employee portal by visiting our login page and entering your employee ID and password. If you're a new employee, your credentials will be provided during orientation. For password resets, contact the ICT department at ext. 1234.",
      category: "Account Access",
      icon: "🔐",
    },
    {
      question: "What benefits are available to employees?",
      answer:
        "Westlake Medical Center offers comprehensive benefits including health insurance, dental coverage, life insurance, retirement plans, paid time off, professional development opportunities, and employee wellness programs. Detailed benefits information is available in your employee handbook.",
      category: "Benefits",
      icon: "💼",
    },
    {
      question: "How do I request time off or sick leave?",
      answer:
        "Time off requests can be submitted through the employee portal under the 'Leave Management' section. For sick leave, notify your supervisor as soon as possible and submit documentation within 24 hours. Emergency situations will be handled on a case-by-case basis.",
      category: "Leave Management",
      icon: "📅",
    },
    {
      question: "Where can I find my pay stubs and tax documents?",
      answer:
        "All pay stubs, W-2 forms, and tax documents are available in the 'Payroll' section of your employee portal. Documents are typically available by January 31st each year. You can download and print these documents as needed.",
      category: "Payroll",
      icon: "💰",
    },
    {
      question: "How do I update my personal information?",
      answer:
        "Personal information updates can be made through the employee portal under 'My Profile'. Some changes may require HR approval. For emergency contact updates or address changes, please also notify HR directly to ensure all systems are updated.",
      category: "Profile Management",
      icon: "👤",
    },
    {
      question: "What training opportunities are available?",
      answer:
        "We offer continuous education programs, certification courses, professional development workshops, and leadership training. Check the 'Learning & Development' section in your portal for current offerings and to register for courses.",
      category: "Training",
      icon: "🎓",
    },
    {
      question: "Who do I contact for technical support?",
      answer:
        "For technical issues with the employee portal or other IT-related problems, contact the ICT Department at ext. 1234 or email ict@westlakemedical.com. Support hours are Monday-Friday, 8:00 AM - 5:00 PM.",
      category: "Technical Support",
      icon: "💻",
    },
    {
      question: "How do I report workplace concerns or incidents?",
      answer:
        "Workplace concerns can be reported through the 'Employee Relations' section of the portal, directly to HR, or through our anonymous reporting system. All reports are handled confidentially and in accordance with company policy.",
      category: "Employee Relations",
      icon: "⚠️",
    },
  ];

  const filteredFaqs: FAQ[] = faqData.filter(
    (faq: FAQ) =>
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/10 to-indigo-400/10 rounded-full blur-3xl"
          animate={{
            x: mousePosition.x * 0.02,
            y: mousePosition.y * 0.02,
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-full blur-3xl"
          animate={{
            x: -mousePosition.x * 0.02,
            y: -mousePosition.y * 0.02,
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Navigation */}
      <ModernNav />
      {/* Hero Section */}
      <motion.div
        className="relative z-10 max-w-4xl mx-auto px-6 py-16 text-center"
        variants={containerVariants}
        initial="hidden"
        animate={isLoaded ? "visible" : "hidden"}
      >
        <motion.div variants={itemVariants} className="mb-8">
          <span className="inline-block px-4 py-2 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 rounded-full text-sm font-semibold mb-4">
            <HelpCircle className="w-4 h-4 inline mr-2" />
            Frequently Asked Questions
          </span>
          <h2 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            We&apos;re here to{" "}
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              help you
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Find answers to common questions about our employee portal,
            benefits, and workplace policies.
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div variants={itemVariants} className="relative mb-12">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search for answers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none text-lg bg-white/70 backdrop-blur-sm shadow-lg transition-all duration-300"
            />
          </div>
        </motion.div>
      </motion.div>

      {/* FAQ Section */}
      <motion.div
        className="relative z-10 max-w-4xl mx-auto px-6 pb-16"
        variants={containerVariants}
        initial="hidden"
        animate={isLoaded ? "visible" : "hidden"}
      >
        <div className="space-y-4">
          {filteredFaqs.map((faq, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200/50 overflow-hidden"
              whileHover={{ scale: 1.01 }}
            >
              <button
                className="w-full p-6 text-left flex items-center justify-between"
                onClick={() =>
                  setActiveIndex(activeIndex === index ? null : index)
                }
              >
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center text-2xl">
                    {faq.icon}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm text-blue-600 font-semibold mb-1">
                      {faq.category}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {faq.question}
                    </h3>
                  </div>
                </div>
                <motion.div
                  animate={{ rotate: activeIndex === index ? 45 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center ml-4"
                >
                  <Plus className="w-5 h-5 text-white" />
                </motion.div>
              </button>

              <AnimatePresence>
                {activeIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 pl-20">
                      <p className="text-gray-700 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {filteredFaqs.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              No results found
            </h3>
            <p className="text-gray-600">
              Try adjusting your search terms or browse all questions above.
            </p>
          </motion.div>
        )}
      </motion.div>

      {/* Footer */}
      <motion.footer
        className="relative z-10 text-center py-8 border-t border-gray-200/50 bg-white/30 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
      >
        <div className="flex items-center justify-center space-x-2 text-gray-600 mb-4">
          <Shield className="w-4 h-4" />
          <span>Powered by Westlake Medical Center ICT Department</span>
        </div>
        <p className="text-sm text-gray-500">
          © 2025 Westlake Medical Center. All rights reserved.
        </p>
      </motion.footer>
    </div>
  );
};

export default Faqs;
