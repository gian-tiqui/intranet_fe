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
    <div className="md:h-screen md:bg-gradient-to-b pb-52 md:pb-0 from-white dark:from-black via-neutral-100 dark:via-neutral-800 to-neutral-300 dark:to-neutral-800">
      {showLogoutArt && <SignOutSplash />}

      {children}
    </div>
  );
};

export default LoginTemplate;
