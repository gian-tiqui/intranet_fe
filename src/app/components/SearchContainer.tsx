import React, { useState } from "react";
import searchTermStore from "../store/search";
import { Button } from "primereact/button";
import { PrimeIcons } from "primereact/api";
import useShowSearchStore from "../store/showSearch";
import { Image } from "primereact/image";
import wmcLogo from "../assets/westlake_logo_horizontal.jpg.png";
import { Query } from "../types/types";
import { useQuery } from "@tanstack/react-query";
import { search } from "../utils/service/searchService";
import { useForm } from "react-hook-form";

interface FormFields {
  searchTerm: string;
}

const SearchContainer = () => {
  const { searchTerm, setSearchTerm } = searchTermStore();
  const { setShowSearch } = useShowSearchStore();
  const [query, setQuery] = useState<Query>({
    search: searchTerm,
    skip: 0,
    take: 10,
  });

  const { register, handleSubmit } = useForm<FormFields>({
    values: { searchTerm },
  });

  const handleClose = () => {
    setShowSearch(false);
    setSearchTerm("");
  };

  const handleSearch = ({ searchTerm }: FormFields) => {
    if (!searchTerm) return;

    setQuery((prev) => ({ ...prev, search: searchTerm }));
  };

  const { data, isLoading, isError, error } = useQuery({
    queryKey: [`search-${JSON.stringify(query)}`],
    queryFn: () => search(query),
  });

  if (isError) {
    console.error(error);
  }

  return (
    <div className="absolute h-screen w-screen bg-[#CBD5E1] z-20">
      <header className="h-32 w-full flex items-center px-3 justify-between">
        <div className="flex items-center gap-4 w-full">
          <Image src={wmcLogo.src} alt="wmc logo" height="45" width="45" />
          <div className="text-blue-600">
            <h4 className="font-semibold text-xl">Westlake</h4>
            <h6 className="text-xs font-semibold">Medical Center</h6>
          </div>
        </div>
        <div className="w-full">
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
        </div>

        <div className="w-full flex justify-end">
          <Button
            onClick={handleClose}
            icon={`${PrimeIcons.TIMES} text-xl`}
            className="h-14 w-14"
          ></Button>
        </div>
      </header>
      <section>
        {isLoading && <p>Loading...</p>}
        {isError && (
          <p>There was a problem with your search. Try again later.</p>
        )}
        {JSON.stringify(data?.data)}
      </section>
    </div>
  );
};

export default SearchContainer;
