import React, { Dispatch, SetStateAction } from "react";
import { MinMax } from "@/app/types/types";
import { Icon } from "@iconify/react/dist/iconify.js";

interface Props {
  setDirection?: Dispatch<SetStateAction<string>>;
  setMinMax: Dispatch<SetStateAction<MinMax>>;
  totalPosts: number;
  limit: number;
  isLastPage?: boolean;
  min: number;
}

const Shortcuts: React.FC<Props> = ({ setMinMax, totalPosts, limit, min }) => {
  const totalPages = Math.ceil(totalPosts / limit);
  const isFirstPage = min === 0;
  const currentPage = Math.floor(min / limit) + 1;
  const calculatedIsLastPage = currentPage === totalPages;

  const jumpPage = (selection: string) => {
    if (selection === "first") setMinMax({ min: 0, max: Math.min(2, limit) });
    else if (selection === "last") {
      setMinMax({
        min: (totalPages - 1) * limit,
        max: Math.min(2, totalPages * limit),
      });
    }
  };

  const handlePageMove = (selection: string) => {
    setMinMax((prev) => {
      const newMin =
        selection === "next"
          ? Math.min(prev.min + limit, (totalPages - 1) * limit)
          : Math.max(prev.min - limit, 0);

      const newMax = Math.min(2, newMin + limit);
      return { min: newMin, max: newMax };
    });
  };

  const buttonClass =
    "rounded-full px-4 py-2 text-sm font-semibold flex items-center gap-2 transition-all shadow bg-[#EEEEEE] hover:bg-gray-200 dark:bg-neutral-800 dark:hover:bg-neutral-700";

  const disabledClass = "opacity-50 cursor-not-allowed pointer-events-none";

  return (
    <div className="flex flex-wrap gap-3 justify-center md:justify-start my-10 max-w-[85%] mx-auto">
      <button
        onClick={() => jumpPage("first")}
        className={`${buttonClass} ${isFirstPage ? disabledClass : ""}`}
      >
        <Icon icon="ri:forward-end-line" className="rotate-180" />
        First Page
      </button>

      <button
        onClick={() => handlePageMove("prev")}
        className={`${buttonClass} ${isFirstPage ? disabledClass : ""}`}
      >
        <Icon icon="majesticons:next-circle-line" className="rotate-180" />
        Previous
      </button>

      <button
        onClick={() => handlePageMove("next")}
        className={`${buttonClass} ${
          calculatedIsLastPage ? disabledClass : ""
        }`}
      >
        <Icon icon="majesticons:next-circle-line" />
        Next
      </button>

      <button
        onClick={() => jumpPage("last")}
        className={`${buttonClass} ${
          calculatedIsLastPage ? disabledClass : ""
        }`}
      >
        <Icon icon="ri:forward-end-line" />
        Last Page
      </button>
    </div>
  );
};

export default Shortcuts;
