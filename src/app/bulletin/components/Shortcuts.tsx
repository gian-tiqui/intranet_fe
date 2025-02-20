import React, { Dispatch, SetStateAction } from "react";
import { MinMax } from "@/app/types/types";
import { Icon } from "@iconify/react/dist/iconify.js";

interface Props {
  setDirection: Dispatch<SetStateAction<string>>;
  setMinMax: Dispatch<SetStateAction<MinMax>>;
  totalPosts: number;
  limit: number;
  isLastPage: boolean;
  min: number;
}

const Shortcuts: React.FC<Props> = ({ setMinMax, totalPosts, limit, min }) => {
  const totalPages = Math.ceil(totalPosts / limit);
  const isFirstPage = min === 0;
  const currentPage = Math.floor(min / limit) + 1; // Calculate current page
  const calculatedIsLastPage = currentPage === totalPages; // Proper last-page condition

  const jumpPage = (selection: string) => {
    if (selection === "first") setMinMax({ min: 0, max: Math.min(2, limit) });
    else if (selection === "last")
      setMinMax({
        min: (totalPages - 1) * limit,
        max: Math.min(2, totalPages * limit),
      });
  };

  const handlePageMove = (selection: string) => {
    setMinMax((prev) => {
      const newMin =
        selection === "next"
          ? Math.min(prev.min + limit, (totalPages - 1) * limit)
          : Math.max(prev.min - limit, 0);

      const newMax = Math.min(2, newMin + limit); // Ensure max is capped at 2
      return { min: newMin, max: newMax };
    });
  };

  return (
    <div className="flex flex-wrap my-12 gap-2">
      <div
        onClick={() => !isFirstPage && jumpPage("first")}
        className={`rounded-full px-3 py-2 cursor-pointer dark:hover:bg-neutral-700 bg-white hover:bg-gray-100 dark:bg-neutral-900 flex gap-1 items-center ${
          isFirstPage ? "cursor-not-allowed opacity-50" : ""
        }`}
        style={{ pointerEvents: isFirstPage ? "none" : "auto" }}
      >
        <Icon icon={"ri:forward-end-line"} className="rotate-180" />
        <p className="text-sm font-bold">First Page</p>
      </div>
      <div
        onClick={() => !isFirstPage && handlePageMove("prev")}
        className={`rounded-full px-3 py-2 cursor-pointer dark:hover:bg-neutral-700 bg-white hover:bg-gray-100 dark:bg-neutral-900 flex gap-1 items-center ${
          isFirstPage ? "cursor-not-allowed opacity-50" : ""
        }`}
        style={{ pointerEvents: isFirstPage ? "none" : "auto" }}
      >
        <Icon icon={"majesticons:next-circle-line"} className="rotate-180" />
        <p className="text-sm font-bold">Previous Page</p>
      </div>
      <div
        onClick={() => !calculatedIsLastPage && handlePageMove("next")}
        className={`rounded-full px-3 py-2 cursor-pointer dark:hover:bg-neutral-700 bg-white hover:bg-gray-100 dark:bg-neutral-900 flex gap-1 items-center ${
          calculatedIsLastPage ? "cursor-not-allowed opacity-50" : ""
        }`}
        style={{ pointerEvents: calculatedIsLastPage ? "none" : "auto" }}
      >
        <Icon icon={"majesticons:next-circle-line"} />
        <p className="text-sm font-bold">Next Page</p>
      </div>
      <div
        onClick={() => !calculatedIsLastPage && jumpPage("last")}
        className={`rounded-full px-3 py-2 cursor-pointer dark:hover:bg-neutral-700 bg-white hover:bg-gray-100 dark:bg-neutral-900 flex gap-1 items-center ${
          calculatedIsLastPage ? "cursor-not-allowed opacity-50" : ""
        }`}
        style={{ pointerEvents: calculatedIsLastPage ? "none" : "auto" }}
      >
        <Icon icon={"ri:forward-end-line"} />
        <p className="text-sm font-bold">Last Page</p>
      </div>
    </div>
  );
};

export default Shortcuts;
