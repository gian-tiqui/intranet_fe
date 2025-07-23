import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { decodeUserData } from "../functions/functions";
import { TutorialContent } from "../types/types";
import { Department } from "../utils/enums/enum";
import { findUserById, updateUserById } from "../utils/service/userService";
import epPage from "../assets/employee-portal-ss.png";
import { Image } from "primereact/image";

const userPages: TutorialContent[] = [
  {
    title: "test",
    instruction:
      "akdmdaksm kmdakmsdkmdsakmldsa dsakmsdkmklmasdlkmasd dsakmlkmlasdkmlasdkmlads asdkmkmasldkmlasdkmlasdkmlasd",
    image: epPage.src,
  },
  {
    title: "test2",
    instruction:
      "2akdmdaksm kmdakmsdkmdsakmldsa dsakmsdkmklmasdlkmasd dsakmlkmlasdkmlasdkmlads asdkmkmasldkmlasdkmlasdkmlasd",
    image: epPage.src,
  },
  {
    title: "test3",
    instruction:
      "3akdmdaksm kmdakmsdkmdsakmldsa dsakmsdkmklmasdlkmasd dsakmlkmlasdkmlasdkmlads asdkmkmasldkmlasdkmlasdkmlasd",
    image: epPage.src,
  },
];

const hRQmPages: TutorialContent[] = [
  {
    title: "testhr",
    instruction:
      "akdmdaksm kmdakmsdkmdsakmldsa dsakmsdkmklmasdlkmasd dsakmlkmlasdkmlasdkmlads asdkmkmasldkmlasdkmlasdkmlasd",
    image: epPage.src,
  },
  {
    title: "test2hr",
    instruction:
      "2akdmdaksm kmdakmsdkmdsakmldsa dsakmsdkmklmasdlkmasd dsakmlkmlasdkmlasdkmlads asdkmkmasldkmlasdkmlasdkmlasd",
    image: epPage.src,
  },
  {
    title: "test3hr",
    instruction:
      "3akdmdaksm kmdakmsdkmdsakmldsa dsakmsdkmklmasdlkmasd dsakmlkmlasdkmlasdkmlads asdkmkmasldkmlasdkmlasdkmlasd",
    image: epPage.src,
  },
];

const Tutorial = () => {
  const [isFirstLogin, setIsFirstLogin] = useState<boolean>(false);
  const [pageNumber, setPageNumber] = useState<number>(0);
  const [pagesBasedOnDepartment, setPagesBasedOnDepartment] = useState<
    TutorialContent[]
  >([]);

  useEffect(() => {
    const f = async () => {
      try {
        const decoded = decodeUserData();

        const { data } = await findUserById(decoded?.sub);

        if (data.user) {
          setIsFirstLogin(Boolean(data.user.isFirstLogin));
        }

        if (
          [
            Department.CUSTOMER_EXPERIENCE,
            Department.HUMAN_RESOURCE,
            Department.QUALITY_MANAGEMENT,
          ].includes(decoded?.deptId ?? 0)
        ) {
          setPagesBasedOnDepartment(hRQmPages);
        } else {
          setPagesBasedOnDepartment(userPages);
        }
      } catch (error) {
        console.error(error);
      }
    };

    f();
  }, []);

  if (!isFirstLogin) return null;

  const handleFinishButtonClicked = async () => {
    const decoded = decodeUserData();

    if (!decoded) return;

    try {
      const { data, status } = await updateUserById(
        decoded.sub,
        { isFirstLogin: 0 },
        decoded.sub
      );

      if (status === 200) {
        setIsFirstLogin(false);
      }
    } catch (error) {
      console.error("There was an error: ", error);
    }
  };

  const currentPage = pagesBasedOnDepartment[pageNumber];
  const totalPages = pagesBasedOnDepartment.length;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-white/95 backdrop-blur-xl flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full max-w-4xl h-[90vh] bg-white/80 backdrop-blur-2xl rounded-3xl border border-slate-300/30 shadow-2xl overflow-hidden flex flex-col"
        >
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-300/5 via-gray-100/5 to-slate-300/5 pointer-events-none" />

          {/* Header */}
          <motion.header
            key={`header-${pageNumber}`}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="relative z-10 px-8 py-6 border-b border-slate-300/30 backdrop-blur-md flex-shrink-0"
          >
            <div className="flex items-center justify-between">
              <motion.h1
                key={currentPage?.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-3xl font-bold bg-gradient-to-r from-slate-600 to-slate-700 bg-clip-text text-transparent"
              >
                {currentPage?.title}
              </motion.h1>

              {/* Progress indicator */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600">
                  {pageNumber + 1} of {totalPages}
                </span>
                <div className="flex gap-1">
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <motion.div
                      key={i}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        i === pageNumber ? "bg-slate-400" : "bg-slate-300"
                      }`}
                      animate={{
                        scale: i === pageNumber ? 1.2 : 1,
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.header>

          {/* Content */}
          <div className="relative z-10 flex-1 p-8 overflow-auto">
            <div className="flex flex-col gap-6 h-full">
              {/* Image Section */}
              <motion.section
                key={`image-${pageNumber}`}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="relative flex-1"
              >
                <div className="h-full bg-gradient-to-br from-slate-300/40 to-slate-300/20 rounded-2xl p-4 border border-slate-300/40 backdrop-blur-md">
                  <div className="relative h-full rounded-xl overflow-hidden bg-gray-100/60 border border-slate-300/30 backdrop-blur-sm">
                    <Image
                      src={currentPage?.image}
                      alt={`Tutorial step ${pageNumber + 1}`}
                      className="w-full h-full object-contain"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent" />
                  </div>
                </div>
              </motion.section>

              {/* Instruction Section */}
              <motion.section
                key={`instruction-${pageNumber}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="relative flex-shrink-0 pb-6"
              >
                <div className="bg-gradient-to-br from-gray-100/50 to-gray-100/30 rounded-2xl border border-slate-300/40 backdrop-blur-md max-h-48 overflow-hidden">
                  <div
                    className="p-6 overflow-y-auto max-h-48 instruction-scroll"
                    style={{
                      scrollbarWidth: "thin",
                      scrollbarColor: "#94a3b8 transparent",
                    }}
                  >
                    <style jsx>{`
                      .instruction-scroll::-webkit-scrollbar {
                        width: 8px;
                      }
                      .instruction-scroll::-webkit-scrollbar-track {
                        background: transparent;
                      }
                      .instruction-scroll::-webkit-scrollbar-thumb {
                        background-color: #94a3b8;
                        border-radius: 4px;
                        border: 1px solid transparent;
                      }
                      .instruction-scroll::-webkit-scrollbar-thumb:hover {
                        background-color: #64748b;
                      }
                    `}</style>
                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="text-lg leading-relaxed text-slate-700 font-medium"
                    >
                      {currentPage?.instruction}
                    </motion.p>
                  </div>
                </div>
              </motion.section>
            </div>
          </div>

          {/* Footer */}
          <motion.footer
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="relative z-10 px-8 py-6 border-t border-slate-300/40 bg-gray-100/40 backdrop-blur-md flex-shrink-0"
          >
            <div className="flex items-center justify-between">
              <motion.button
                whileHover={{ scale: 1.05, x: -5 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  if (pageNumber > 0) setPageNumber((prev) => prev - 1);
                }}
                disabled={pageNumber === 0}
                className="px-6 py-3 rounded-xl bg-slate-300/40 hover:bg-slate-300/60 disabled:opacity-50 disabled:cursor-not-allowed text-slate-700 font-medium transition-all duration-200 border border-slate-300/50 backdrop-blur-md"
              >
                ← Previous
              </motion.button>

              <div className="flex gap-3">
                {pageNumber < totalPages - 1 ? (
                  <motion.button
                    whileHover={{ scale: 1.05, x: 5 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      if (pageNumber < totalPages - 1)
                        setPageNumber((prev) => prev + 1);
                    }}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium transition-all duration-200 shadow-lg shadow-blue-500/25"
                  >
                    Next →
                  </motion.button>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleFinishButtonClicked}
                    className="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium transition-all duration-200 shadow-lg shadow-blue-600/25"
                  >
                    ✓ Finish
                  </motion.button>
                )}
              </div>
            </div>
          </motion.footer>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Tutorial;
