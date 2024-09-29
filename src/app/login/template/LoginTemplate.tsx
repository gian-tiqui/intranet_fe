import React, { ReactNode } from "react";

interface Props {
  children?: ReactNode;
}

const LoginTemplate: React.FC<Props> = ({ children }) => {
  return (
    <div className="h-screen bg-gradient-to-b from-white dark:from-black via-neutral-100 dark:via-neutral-800 to-neutral-400 dark:to-neutral-800 flex flex-col items-center">
      {children}
    </div>
  );
};

export default LoginTemplate;
