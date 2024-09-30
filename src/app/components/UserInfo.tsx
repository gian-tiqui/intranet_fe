import React from "react";
import HoverBox from "./HoverBox";
import { Icon } from "@iconify/react/dist/iconify.js";

interface Props {
  mode: string;
  handleModeChange: () => void;
}

const UserInfo: React.FC<Props> = ({ mode, handleModeChange }) => {
  return (
    <>
      <div className="flex flex-row-reverse">
        <HoverBox className="hover:bg-neutral-300 dark:hover:bg-neutral-800 p-1 cursor-pointer rounded">
          <div className="flex items-center gap-3" onClick={handleModeChange}>
            {mode === "save" ? (
              <>
                <Icon icon={"lucide:edit"} className="w-5 h-5" />
                <p className="text-md">Edit profile</p>
              </>
            ) : (
              <>
                <Icon icon={"mingcute:save-line"} className="w-5 h-5" />
                <p className="text-md">Save profile</p>
              </>
            )}
          </div>
        </HoverBox>
      </div>
      <div></div>
    </>
  );
};

export default UserInfo;
