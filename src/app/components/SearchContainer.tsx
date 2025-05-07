import React, { useEffect, useState } from "react";
import searchTermStore from "../store/search";
import { Button } from "primereact/button";
import { PrimeIcons } from "primereact/api";
import useShowSearchStore from "../store/showSearch";
import { Image } from "primereact/image";
import wmcLogo from "../assets/westlake_logo_horizontal.jpg.png";
import { Folder, Post, Query, User } from "../types/types";
import { useQuery } from "@tanstack/react-query";
import { search } from "../utils/service/searchService";
import { useForm } from "react-hook-form";
import UserSearchItem from "./UserSearchItem";
import PostSearchItem from "./PostSearchItem";
import FolderSearchItem from "./FolderSearchItem";

interface FormFields {
  searchTerm: string;
}

const SearchContainer = () => {
  const { searchTerm, setSearchTerm } = searchTermStore();
  const { setShowSearch } = useShowSearchStore();
  const [query, setQuery] = useState<Query>({
    search: searchTerm,
    skip: 0,
    take: 5,
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

  useEffect(() => {
    console.log(data?.data);
  }, [data]);

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
      <section className="py-3 flex flex-col items-center mx-auto h-96 bg-[#EEEEEE] w-[43%] rounded-t-2xl shadow">
        {isLoading && <p>Loading...</p>}
        {isError && (
          <p>There was a problem with your search. Try again later.</p>
        )}
        <p className="my-2">Results for this search: {data?.data.total}</p>
        {data?.data.results.map(
          (
            item: { type: string; data: Post | Folder | User },
            index: number
          ) => {
            switch (item.type) {
              case "post":
                const post: Post = item.data as Post;

                return (
                  <PostSearchItem
                    index={index}
                    type={item.type}
                    key={post.pid}
                    post={post}
                    handleClose={handleClose}
                  />
                );
                break;
              case "folder":
                const folder: Folder = item.data as Folder;

                return (
                  <FolderSearchItem
                    index={index}
                    type={item.type}
                    key={folder.id}
                    folder={folder}
                    handleClose={handleClose}
                  />
                );
                break;
              case "user":
                const user: User = item.data as User;

                return (
                  <UserSearchItem
                    index={index}
                    key={user.id}
                    type={item.type}
                    user={user}
                    handleClose={handleClose}
                  />
                );
                break;
              default:
                return <p>There was an error in this item</p>;
            }
          }
        )}
      </section>
      <footer className="w-[43%] mx-auto bg-[#EEEEEE] rounded-b-3xl pb-4 px-5 flex justify-between gap-2">
        <Button
          onClick={() => {
            setQuery((prev) => {
              const skip = prev.skip ?? 0;
              const take = prev.take ?? 5;
              const newSkip = Math.max(skip - take, 0);
              return { ...prev, skip: newSkip };
            });
          }}
          disabled={(query.skip ?? 0) === 0}
          className="h-7 w-7 bg-blue-600 justify-center text-white text-sm font-medium disabled:opacity-50"
          icon={`${PrimeIcons.ARROW_LEFT} text-xs`}
        ></Button>

        <span className="text-sm font-medium self-center">
          Page {Math.floor((query.skip ?? 0) / (query.take ?? 5)) + 1} of{" "}
          {data ? Math.ceil(data.data.total / (query.take ?? 5)) : 1}
        </span>

        <Button
          onClick={() => {
            setQuery((prev) => {
              const skip = prev.skip ?? 0;
              const take = prev.take ?? 5;
              const nextSkip = skip + take;
              if (data && nextSkip >= data.data.total) return prev;
              return { ...prev, skip: nextSkip };
            });
          }}
          disabled={
            data
              ? (query.skip ?? 0) + (query.take ?? 5) >= data.data.total
              : true
          }
          className="h-7 w-7 bg-blue-600 justify-center text-white text-sm font-medium disabled:opacity-50"
          icon={`${PrimeIcons.ARROW_RIGHT} text-xs`}
        ></Button>
      </footer>
    </div>
  );
};

export default SearchContainer;
