"use client";
import React from "react";
import { Icon } from "@iconify/react";
import HoverBox from "./HoverBox";

const Navbar = () => {
  return (
    <nav className="h-full absolute left-0 w-64 bg-white shadow">
      <div id="buttons" className="flex justify-between w-full px-3 pt-2">
        <HoverBox>
          <Icon icon="iconoir:sidebar-collapse" className="h-5 w-5" />
        </HoverBox>
        <HoverBox>
          <Icon icon="lucide:edit" className="h-5 w-5" />
        </HoverBox>
      </div>
      <div id="buttons" className="overflow-y-auto px-3 mt-2">
        <HoverBox>
          <div className="flex items-center gap-2">
            <Icon icon="ph:hospital-fill" className="h-5 w-5" />
            <p className="w-full">Intranet</p>
          </div>
        </HoverBox>
        <HoverBox>
          <div className="flex items-center gap-2">
            <Icon icon="fluent:grid-circles-24-regular" className="h-5 w-5" />
            <p className="w-full">Explore Intranet</p>
          </div>
        </HoverBox>
      </div>
    </nav>
  );
};

export default Navbar;
