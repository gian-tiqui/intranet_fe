"use client";
import ModeToggler from "@/app/components/ModeToggler";
import React from "react";
import ForgotPasswordForm from "./ForgotPasswordForm";

const ForgotPassword = () => {
  return (
    <div className="h-screen w-full grid place-content-center">
      <div className="absolute top-4 right-4">
        <ModeToggler />
      </div>
      <ForgotPasswordForm />
    </div>
  );
};

export default ForgotPassword;
