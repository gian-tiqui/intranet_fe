"use client";
import SignOutSplash from "@/app/components/SignOutSplash";
import useLogoutArtStore from "@/app/store/useLogoutSplashStore";
import React, { ReactNode } from "react";

interface Props {
  children?: ReactNode;
}

const LoginTemplate: React.FC<Props> = ({ children }) => {
  const { showLogoutArt } = useLogoutArtStore();

  return (
    <div className="relative  h-screen pb-52 md:pb-0">
      {showLogoutArt && <SignOutSplash />}
      {children}
    </div>
  );
};

export default LoginTemplate;
