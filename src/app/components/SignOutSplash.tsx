"use client";
import React, { ReactNode } from "react";
import loginAnim from "../assets/logoutAnim2.json";
import { useLottie } from "lottie-react";

interface Props {
  children?: ReactNode;
}

const SignOutSplash: React.FC<Props> = ({ children }) => {
  const logginAnimOptions = {
    animationData: loginAnim,
    loop: true,
    className: "",
  };
  const { View } = useLottie(logginAnimOptions);

  return (
    <div className="absolute w-full h-full bg-[#CBD5E1] grid place-content-center z-30">
      <div className="h-72 w-72 bg-gray-300 p-5 grid place-content-center rounded-xl">
        {children ? children : View}
      </div>
    </div>
  );
};

export default SignOutSplash;
