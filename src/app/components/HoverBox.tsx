"use client";
import React, { ReactNode } from "react";
import useToggleStore from "../store/navbarCollapsedStore";

interface Props {
  children?: ReactNode;
  className?: string;
  collapser?: boolean;
}

const HoverBox: React.FC<Props> = ({
  children,
  className,
  collapser = false,
}) => {
  const { isCollapsed, setIsCollapsed } = useToggleStore();

  const handleCollapsed = () => setIsCollapsed(!isCollapsed);

  return (
    <div
      onClick={collapser ? handleCollapsed : undefined}
      className={className}
    >
      {children}
    </div>
  );
};

export default HoverBox;
