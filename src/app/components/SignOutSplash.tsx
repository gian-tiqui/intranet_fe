"use client";
import React, { ReactNode } from "react";
import loginAnim from "../assets/logoutAnim.json";
import { useLottie } from "lottie-react";

interface Props {
  children?: ReactNode;
}

const SignOutSplash: React.FC<Props> = ({ children }) => {
  const logginAnimOptions = {
    animationData: loginAnim,
    loop: true,
  };
  const { View } = useLottie(logginAnimOptions);

  return (
    <div className="absolute w-full h-full bg-neutral-200 grid place-content-center dark:bg-neutral-800 z-30">
      <div className="h-96 w-96 bg-gray-300 p-5  grid place-content-center rounded-xl">
        {children ? children : View}
      </div>
    </div>
  );
};

export default SignOutSplash;
