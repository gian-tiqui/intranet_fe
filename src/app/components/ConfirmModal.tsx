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
  const handleButtonClick = (option: "yes" | "no") => {
    if (option === "yes") {
      setConfirmed(true);
    }
    setShowConfirmModal(false);
  };

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="w-72 bg-[#EEE] dark:bg-neutral-900 rounded-2xl shadow-xl px-6 pt-8 pb-4 text-center transition duration-300 border border-gray-200 dark:border-neutral-700"
    >
      <Icon
        icon="material-symbols:warning-outline"
        className="mx-auto mb-3 h-10 w-10 text-yellow-500"
      />
      <p className="font-semibold text-gray-800 dark:text-white mb-6 text-sm">
        You have not read the post yet. Are you sure you want to leave?
      </p>

      <div className="flex gap-3">
        <button
          onClick={() => handleButtonClick("yes")}
          className="flex-1 py-2 rounded-lg border border-blue-600 bg-blue-600 text-white hover:bg-blue-700 transition text-sm font-medium"
        >
          Yes, leave
        </button>
        <button
          onClick={() => handleButtonClick("no")}
          className="flex-1 py-2 rounded-lg border border-gray-300 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-neutral-700 transition text-sm font-medium"
        >
          No, stay
        </button>
      </div>
    </div>
  );
};

export default ConfirmModal;
