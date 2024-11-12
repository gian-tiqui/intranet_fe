import { Icon } from "@iconify/react/dist/iconify.js";
import React from "react";

const Footer = () => {
  return (
    <div className="bg-neutral-300 dark:bg-neutral-800 p-10 flex justify-center items-center">
      <div className="md:w-[50%] flex justify-between">
        <div>
          <p className="text-sm font-semibold">Mt. Grace Hospitals © 2018</p>
        </div>
        <div className="flex gap-2">
          <Icon className="h-5 w-5" icon={"ic:outline-facebook"} />
          <Icon className="h-5 w-5" icon={"basil:viber-outline"} />
          <Icon className="h-5 w-5" icon={"streamline:gmail"} />
        </div>
      </div>
    </div>
  );
};

export default Footer;
