import { PrimeIcons } from "primereact/api";
import { Button } from "primereact/button";
import React from "react";
import { useForm } from "react-hook-form";
import searchTermStore from "../store/search";
import useShowSearchStore from "../store/showSearch";
import { motion } from "motion/react";

interface FormFields {
  searchTerm: string;
}

const SearchV2 = () => {
  const { handleSubmit, register, reset, watch } = useForm<FormFields>();
  const { setSearchTerm } = searchTermStore();
  const { setShowSearch } = useShowSearchStore();

  const handleSearch = (data: FormFields) => {
    if (!data.searchTerm) return;

    setSearchTerm(data.searchTerm);
    setShowSearch(true);
    reset();
  };

  return (
    <motion.form
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3, duration: 1 }}
      onSubmit={handleSubmit(handleSearch)}
      className={`bg-[#EEEEEE] w-full h-18 mt-4 rounded-full justify-between border-2 p-1 ${
        (watch("searchTerm") || "").length > 0
          ? "border-blue-600"
          : "border-black"
      } mb-6 flex items-center ps-7 cursor-text`}
    >
      <input
        type="text"
        {...register("searchTerm")}
        className="border-none bg-inherit outline-none w-96"
        placeholder="Search here..."
      />
      <Button
        className="bg-white rounded-full shadow-xl h-14 w-40 border justify-center gap-2 hover:bg-blue-600 hover:shadow-2xl hover:text-white"
        icon={PrimeIcons.SEARCH}
      >
        Search
      </Button>
    </motion.form>
  );
};

export default SearchV2;
