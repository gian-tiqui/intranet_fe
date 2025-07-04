"use client";
import { checkDept } from "@/app/functions/functions";
import useShowPostStore from "@/app/store/showPostStore";
import React from "react";

const NoPosts = () => {
  const { setVisible } = useShowPostStore();

  return (
    <div className="flex flex-col items-center justify-center h-96 w-full px-6">
      {/* Icon Container */}
      <div className="relative mb-8">
        <div className="w-24 h-24 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-full flex items-center justify-center shadow-lg">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
              />
            </svg>
          </div>
        </div>
        {/* Floating dots */}
        <div className="absolute -top-2 -right-2 w-4 h-4 bg-blue-200 rounded-full animate-pulse"></div>
        <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-indigo-200 rounded-full animate-pulse delay-300"></div>
      </div>

      {/* Text Content */}
      <div className="text-center max-w-md">
        <h3 className="text-2xl font-bold text-gray-800 mb-3">No posts yet</h3>

        {checkDept() ? (
          <p className="text-gray-500 text-lg leading-relaxed mb-6">
            Your feed is empty. Start sharing your thoughts and connect with
            others!
          </p>
        ) : (
          <p className="text-gray-500 text-lg leading-relaxed mb-6">
            Your feed is empty.
          </p>
        )}

        {/* Call to Action */}
        {checkDept() && (
          <div
            onClick={() => setVisible(true)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 cursor-pointer"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Create your first post
          </div>
        )}
      </div>
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-indigo-100 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-1000"></div>
      </div>
    </div>
  );
};

export default NoPosts;
