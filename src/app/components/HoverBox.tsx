import React, { ReactNode } from "react";

interface Props {
  children?: ReactNode;
  className?: string;
}

const HoverBox: React.FC<Props> = ({ children, className }) => {
  return <div className={className}>{children}</div>;
};

export default HoverBox;
