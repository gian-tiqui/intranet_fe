import React, { ReactNode } from "react";

interface Props {
  children?: ReactNode;
}

const LoginTemplate: React.FC<Props> = ({ children }) => {
  return (
    <div className="h-screen bg-gradient-to-b from-white dark:from-black via-neutral-100 dark:via-neutral-800 to-neutral-300 dark:to-neutral-800">
      {children}
    </div>
  );
};

export default LoginTemplate;
