import ModeToggler from "@/app/components/ModeToggler";
import React from "react";

const Appbar = () => {
  return (
    <div className="w-full justify-end flex p-10">
      <div className="">
        <ModeToggler />
      </div>
    </div>
  );
};

export default Appbar;
