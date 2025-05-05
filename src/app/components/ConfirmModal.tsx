import { Icon } from "@iconify/react/dist/iconify.js";
import React, { Dispatch, SetStateAction } from "react";

interface Props {
  setShowConfirmModal: Dispatch<SetStateAction<boolean>>;
  setConfirmed: Dispatch<SetStateAction<boolean>>;
}

const ConfirmModal: React.FC<Props> = ({
  setShowConfirmModal,
  setConfirmed,
}) => {
  const handleButtonClick = (option: string) => {
    if (option === "yes") {
      setConfirmed(true);
      setShowConfirmModal(false);
    } else {
      setShowConfirmModal(false);
    }
  };

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="bg-[#EEEEEE] w-64 rounded-3xl pt-10"
    >
      <Icon
        icon={"material-symbols:warning-outline"}
        className="mx-auto mb-3 h-10 w-10"
      />
      <p className="font-semibold mb-7 w-40 text-center mx-auto">
        You have not read the post yet, leave?
      </p>

      <div className="w-full flex justify-between">
        <button
          onClick={() => handleButtonClick("yes")}
          className="rounded-bl-3xl w-full border py-2 bg-inherit hover:bg-gray-100 border-black"
        >
          Yes
        </button>
        <button
          onClick={() => handleButtonClick("no")}
          className="rounded-br-3xl w-full border py-2 bg-inherit hover:bg-gray-100 border-black"
        >
          No
        </button>
      </div>
    </div>
  );
};

export default ConfirmModal;
