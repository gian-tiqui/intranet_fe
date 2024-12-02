"use client";
import { Icon } from "@iconify/react/dist/iconify.js";
import React, { ChangeEvent } from "react";

interface Props {
  searchText: string;
  handleSearchChange: (event: ChangeEvent<HTMLInputElement>) => void;
  loading: boolean;
}

const Searchbar: React.FC<Props> = ({
  searchText,
  handleSearchChange,
  loading,
}) => {
  return (
    <div className="sm:flex items-center w-48 gap-3 relative hidden bg-neutral-300 dark:bg-neutral-700 h-9 rounded-full px-3">
      {loading ? (
        <Icon icon={"bx:search-alt"} className="h-5 w-5" />
      ) : (
        <Icon icon={"line-md:loading-loop"} className="h-6 w-6" />
      )}
      <input
        className="bg-inherit outline-none w-32 placeholder-neutral-700 dark:placeholder-neutral-400"
        placeholder="Search here"
        onChange={handleSearchChange}
        value={searchText}
      />
    </div>
  );
};

export default Searchbar;
