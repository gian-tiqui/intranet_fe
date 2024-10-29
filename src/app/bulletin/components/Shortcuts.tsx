import React, { Dispatch, SetStateAction } from "react";
import { MinMax } from "@/app/types/types";

interface Props {
  setDirection: Dispatch<SetStateAction<string>>;
  setMinMax: Dispatch<SetStateAction<MinMax>>;
  totalPosts: number;
  limit: number;
  isLastPage: boolean;
}

const Shortcuts: React.FC<Props> = ({
  setDirection,
  setMinMax,
  totalPosts,
  limit,
  isLastPage,
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
      const newMax =
        selection === "next"
          ? prev.max + limit
          : Math.max(prev.max - limit, limit);
      return { min: newMin, max: newMax };
    });
  };

  return (
    <div className="flex flex-wrap my-12 gap-2">
      <div
        onClick={() => handleSortByDate("desc")}
        className="rounded-full px-3 py-2 cursor-pointer dark:hover:bg-neutral-700 bg-white hover:bg-gray-100 dark:bg-neutral-900"
      >
        <p className="text-sm font-bold">Latest</p>
      </div>
      <div
        onClick={() => handleSortByDate("asc")}
        className="rounded-full px-3 py-2 cursor-pointer dark:hover:bg-neutral-700 bg-white hover:bg-gray-100 dark:bg-neutral-900"
      >
        <p className="text-sm font-bold">Oldest</p>
      </div>
      <div
        onClick={() => jumpPage("first")}
        className="rounded-full px-3 py-2 cursor-pointer dark:hover:bg-neutral-700 bg-white hover:bg-gray-100 dark:bg-neutral-900"
      >
        <p className="text-sm font-bold">First Page</p>
      </div>
      <div
        onClick={() => handlePageMove("prev")}
        className="rounded-full px-3 py-2 cursor-pointer dark:hover:bg-neutral-700 bg-white hover:bg-gray-100 dark:bg-neutral-900"
      >
        <p className="text-sm font-bold">Previous Page</p>
      </div>
      <div
        onClick={() => handlePageMove("next")}
        className={`rounded-full px-3 py-2 cursor-pointer dark:hover:bg-neutral-700 bg-white hover:bg-gray-100 dark:bg-neutral-900 ${
          isLastPage ? "cursor-not-allowed opacity-50" : ""
        }`}
        style={{ pointerEvents: isLastPage ? "none" : "auto" }}
      >
        <p className="text-sm font-bold">Next Page</p>
      </div>
      <div
        onClick={() => jumpPage("last")}
        className="rounded-full px-3 py-2 cursor-pointer dark:hover:bg-neutral-700 bg-white hover:bg-gray-100 dark:bg-neutral-900"
      >
        <p className="text-sm font-bold">Last Page</p>
      </div>
    </div>
  );
};

export default Shortcuts;
