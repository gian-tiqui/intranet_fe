import { PrimeIcons } from "primereact/api";
import { Button } from "primereact/button";
import React from "react";

const SearchV2 = () => {
  return (
    <div className="bg-gray-50 w-full h-16 mt-4 rounded-full justify-between border-2 p-2 border-black mb-6 flex items-center ps-7">
      <input
        type="text"
        className="border-none bg-inherit outline-none w-96"
        placeholder="Search here..."
      />
      <Button
        className="bg-white rounded-full shadow h-12 w-32 border justify-center gap-2"
        icon={`${PrimeIcons.SEARCH}`}
      >
        Search
      </Button>
    </div>
  );
};

export default SearchV2;
