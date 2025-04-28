"use client";
import SignOutSplash from "@/app/components/SignOutSplash";
import useLogoutArtStore from "@/app/store/useLogoutSplashStore";
import React, { ReactNode } from "react";
import mediumGradient from "../../assets/medium-gradient.png";
import smallGradient from "../../assets/small-gradient.png";
import largeGradient from "../../assets/large-gradient.png";
import { Image } from "primereact/image";

interface Props {
  children?: ReactNode;
}

const LoginTemplate: React.FC<Props> = ({ children }) => {
  const { showLogoutArt } = useLogoutArtStore();

  return (
    <div className="relative h-screen">
      <Image
        src={largeGradient.src}
        alt="large-gradient"
        className="absolute top-0 right-0 -z-10"
      />
      <Image
        src={mediumGradient.src}
        alt="large-gradient"
        className="absolute bottom-6 left-[570px] -z-10"
      />
      <Image
        src={smallGradient.src}
        alt="large-gradient"
        className="absolute bottom-5 left-[510px] -z-10"
      />
      {showLogoutArt && <SignOutSplash />}
      {children}
    </div>
  );
};

export default LoginTemplate;
