import { PrimeIcons } from "primereact/api";
import { Button } from "primereact/button";
import React from "react";
import { useForm } from "react-hook-form";
import searchTermStore from "../store/search";

interface FormFields {
  searchTerm: string;
}

const SearchV2 = () => {
  const { handleSubmit, register, reset } = useForm<FormFields>();
  const { setSearchTerm } = searchTermStore();
  const handleSearch = (data: FormFields) => {
    if (!data.searchTerm) return;

    setSearchTerm(data.searchTerm);
    reset();
  };

  return (
    <form
      onSubmit={handleSubmit(handleSearch)}
      className="bg-[#EEEEEE] w-full h-16 mt-4 rounded-full justify-between border-2 p-2 border-black mb-6 flex items-center ps-7"
    >
      <input
        type="text"
        {...register("searchTerm")}
        className="border-none bg-inherit outline-none w-96"
        placeholder="Search here..."
      />
      <Button
        className="bg-white rounded-full shadow-xl h-12 w-32 border justify-center gap-2"
        icon={`${PrimeIcons.SEARCH}`}
      >
        Search
      </Button>
    </form>
  );
};

export default SearchV2;
