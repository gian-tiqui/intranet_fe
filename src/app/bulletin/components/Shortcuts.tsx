import React, { Dispatch, SetStateAction } from "react";
import { MinMax } from "@/app/types/types";
import { Icon } from "@iconify/react/dist/iconify.js";

interface Props {
  setDirection: Dispatch<SetStateAction<string>>;
  setMinMax: Dispatch<SetStateAction<MinMax>>;
  totalPosts: number;
  limit: number;
  isLastPage: boolean;
  min: number; // Added min prop to check for first page
}

const Shortcuts: React.FC<Props> = ({
  setDirection,
  setMinMax,
  totalPosts,
  limit,
  isLastPage,
  min,
}) => {
  const totalPages = Math.ceil(totalPosts / limit);

  const handleSortByDate = (_direction: string) => {
    setDirection(_direction);
  };

  const jumpPage = (selection: string) => {
    if (selection === "first") setMinMax({ min: 0, max: limit });
    else if (selection === "last")
      setMinMax({ min: (totalPages - 1) * limit, max: totalPages * limit });
  };

  const handlePageMove = (selection: string) => {
    setMinMax((prev) => {
      const newMin =
        selection === "next" ? prev.min + limit : Math.max(prev.min - limit, 0);

      return { min: newMin, max: 2 };
    });
  };

  return (
    <div className="flex flex-wrap my-12 gap-2">
      <div
        onClick={() => handleSortByDate("desc")}
        className="rounded-full px-3 py-2 cursor-pointer dark:hover:bg-neutral-700 bg-white hover:bg-gray-100 dark:bg-neutral-900 flex gap-1 items-center"
      >
        <Icon icon={"mingcute:time-line"} />
        <p className="text-sm font-bold">Latest</p>
      </div>
      <div
        onClick={() => handleSortByDate("asc")}
        className="rounded-full px-3 py-2 cursor-pointer dark:hover:bg-neutral-700 bg-white hover:bg-gray-100 dark:bg-neutral-900 flex gap-1 items-center"
      >
        <Icon icon={"icon-park-outline:time"} />
        <p className="text-sm font-bold">Oldest</p>
      </div>
      <div
        onClick={() => jumpPage("first")}
        className="rounded-full px-3 py-2 cursor-pointer dark:hover:bg-neutral-700 bg-white hover:bg-gray-100 dark:bg-neutral-900 flex gap-1 items-center"
      >
        <Icon icon={"ri:forward-end-line"} className="rotate-180" />
        <p className="text-sm font-bold">First Page</p>
      </div>
      <div
        onClick={() => handlePageMove("prev")}
        className={`rounded-full px-3 py-2 cursor-pointer dark:hover:bg-neutral-700 bg-white hover:bg-gray-100 dark:bg-neutral-900 flex gap-1 items-center ${
          min === 0 ? "cursor-not-allowed opacity-50" : ""
        }`}
        style={{ pointerEvents: min === 0 ? "none" : "auto" }}
      >
        <Icon icon={"majesticons:next-circle-line"} className="rotate-180" />
        <p className="text-sm font-bold">Previous Page</p>
      </div>
      <div
        onClick={() => handlePageMove("next")}
        className={`rounded-full px-3 py-2 cursor-pointer dark:hover:bg-neutral-700 bg-white hover:bg-gray-100 dark:bg-neutral-900 flex gap-1 items-center ${
          isLastPage ? "cursor-not-allowed opacity-50" : ""
        }`}
        style={{ pointerEvents: isLastPage ? "none" : "auto" }}
      >
        <Icon icon={"majesticons:next-circle-line"} />
        <p className="text-sm font-bold">Next Page</p>
      </div>
      <div
        onClick={() => jumpPage("last")}
        className="rounded-full px-3 py-2 cursor-pointer dark:hover:bg-neutral-700 bg-white hover:bg-gray-100 dark:bg-neutral-900 flex gap-1 items-center"
      >
        <Icon icon={"ri:forward-end-line"} />
        <p className="text-sm font-bold">Last Page</p>
      </div>
    </div>
  );
};

export default Shortcuts;
