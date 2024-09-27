import React, { ReactNode } from "react";

interface Props {
  children?: ReactNode;
}

const HoverBox: React.FC<Props> = ({ children }) => {
  return (
    <div className="hover:bg-gray-200 p-2 cursor-pointer rounded">
      {children}
    </div>
  );
};

export default HoverBox;
