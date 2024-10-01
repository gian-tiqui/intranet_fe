"use client";
import React, { ReactNode } from "react";
import loginAnim from "../assets/loginAnimation.json";
import { useLottie } from "lottie-react";

interface Props {
  children?: ReactNode;
}

const LoginSplash: React.FC<Props> = ({ children }) => {
  const logginAnimOptions = {
    animationData: loginAnim,
    loop: true,
  };
  const { View } = useLottie(logginAnimOptions);

  return (
    <div className="absolute w-full h-full bg-neutral-200 grid place-content-center dark:bg-neutral-800 z-30">
      {children ? children : View}
    </div>
  );
};

export default LoginSplash;
