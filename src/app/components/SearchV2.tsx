import { PrimeIcons } from "primereact/api";
import { Button } from "primereact/button";
import React from "react";
import { useForm } from "react-hook-form";
import searchTermStore from "../store/search";
import useShowSearchStore from "../store/showSearch";

interface FormFields {
  searchTerm: string;
}

const SearchV2 = () => {
  const { handleSubmit, register, reset } = useForm<FormFields>();
  const { setSearchTerm } = searchTermStore();
  const { setShowSearch } = useShowSearchStore();
  const handleSearch = (data: FormFields) => {
    if (!data.searchTerm) return;

    setSearchTerm(data.searchTerm);
    setShowSearch(true);
    reset();
  };

  return (
    <form
      onSubmit={handleSubmit(handleSearch)}
      className="bg-[#EEEEEE] w-full h-18 mt-4 rounded-full justify-between border-2 p-1 border-black mb-6 flex items-center ps-7"
    >
      <input
        type="text"
        {...register("searchTerm")}
        className="border-none bg-inherit outline-none w-96"
        placeholder="Search here..."
      />
      <Button
        className="bg-white rounded-full shadow-xl h-14 w-40 border justify-center gap-2"
        icon={`${PrimeIcons.SEARCH}`}
      >
        Search
      </Button>
    </form>
  );
};

export default SearchV2;
