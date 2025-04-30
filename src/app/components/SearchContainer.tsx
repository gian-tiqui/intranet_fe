import React from "react";
import searchTermStore from "../store/search";
import { Button } from "primereact/button";

const SearchContainer = () => {
  const { setSearchTerm } = searchTermStore();

  const handleClose = () => {
    setSearchTerm("");
  };

  return (
    <div className="absolute h-screen w-screen bg-[#CBD5E1] z-20">
      <Button onClick={handleClose}>close</Button>
    </div>
  );
};

export default SearchContainer;
