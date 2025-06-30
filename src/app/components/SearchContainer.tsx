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
  deptId?: number;
  postTypeId?: number;
  folderDeptId?: number;
}

const SearchContainer = () => {
  const {
    searchTerm,
    deptId,
    postTypeId,
    folderDeptId,
    clearSearchParams,
    searchTypes,
  } = searchTermStore();

  useEffect(() => {
    setQuery({
      search: searchTerm,
      skip: 0,
      take: 5,
      deptId,
      postTypeId,
      folderDeptId,
      searchTypes,
    });
  }, [searchTerm, deptId, postTypeId, folderDeptId, searchTypes]);

  const { setShowSearch } = useShowSearchStore();
  const [query, setQuery] = useState<Query>({
    search: searchTerm,
    deptId,
    postTypeId,
    folderDeptId,
    searchTypes,
    skip: 0,
    take: 5,
  });

  const { register, handleSubmit } = useForm<FormFields>({
    values: { searchTerm },
  });

  const handleClose = () => {
    setShowSearch(false);
    clearSearchParams();
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
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      {/* Modern Modal Container */}
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
        {/* Header with Glassmorphism Effect */}
        <header className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-purple-700 p-6">
          <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
          <div className="relative flex items-center justify-between">
            {/* Logo Section */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Image
                  src={wmcLogo.src}
                  alt="wmc logo"
                  height="32"
                  width="32"
                  className="rounded-lg"
                />
              </div>
              <div className="text-white">
                <h4 className="font-bold text-xl tracking-tight">Westlake</h4>
                <h6 className="text-sm font-medium text-white/80">
                  Medical Center
                </h6>
              </div>
            </div>

            {/* Close Button */}
            <Button
              onClick={handleClose}
              className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 border-0 transition-all duration-200"
              icon={`${PrimeIcons.TIMES} text-white text-lg`}
            />
          </div>

          {/* Modern Search Bar */}
          <form onSubmit={handleSubmit(handleSearch)} className="mt-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <i className={`${PrimeIcons.SEARCH} text-gray-400`}></i>
              </div>
              <input
                type="text"
                {...register("searchTerm")}
                className="w-full pl-12 pr-32 py-4 bg-white/90 backdrop-blur-sm rounded-2xl border-0 outline-none focus:ring-2 focus:ring-white/50 placeholder-gray-500 text-gray-900 font-medium transition-all duration-200"
                placeholder="Search posts, folders, users..."
              />
              <div className="absolute inset-y-0 right-0 pr-2 flex items-center">
                <Button
                  type="submit"
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl border-0 font-semibold text-sm transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Search
                </Button>
              </div>
            </div>
          </form>
        </header>

        {/* Results Section */}
        <section className="max-h-96 overflow-y-auto">
          {/* Results Header */}
          <div className="sticky top-0 bg-gray-50/80 backdrop-blur-sm border-b border-gray-200/50 px-6 py-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-gray-700">
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    Searching...
                  </span>
                ) : (
                  `${data?.data.total || 0} results found`
                )}
              </p>
              {data && data.data.total > 0 && (
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  Live results
                </div>
              )}
            </div>
          </div>

          {/* Results Content */}
          <div className="p-6">
            {isLoading && (
              <div className="flex items-center justify-center py-12">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-gray-600 font-medium">
                    Searching database...
                  </p>
                </div>
              </div>
            )}

            {isError && (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i
                      className={`${PrimeIcons.EXCLAMATION_TRIANGLE} text-red-600 text-2xl`}
                    ></i>
                  </div>
                  <p className="text-gray-800 font-semibold mb-2">
                    Search Error
                  </p>
                  <p className="text-gray-600">
                    There was a problem with your search. Please try again.
                  </p>
                </div>
              </div>
            )}

            {data && data.data.total === 0 && !isLoading && (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i
                      className={`${PrimeIcons.SEARCH} text-gray-400 text-2xl`}
                    ></i>
                  </div>
                  <p className="text-gray-800 font-semibold mb-2">
                    No Results Found
                  </p>
                  <p className="text-gray-600">
                    Try adjusting your search terms or filters.
                  </p>
                </div>
              </div>
            )}

            {/* Search Results */}
            <div className="space-y-3">
              {data?.data.results.map(
                (
                  item: { type: string; data: Post | Folder | User },
                  index: number
                ) => {
                  const itemProps = {
                    index,
                    type: item.type,
                    handleClose,
                    className:
                      "transform transition-all duration-200 hover:scale-[1.02] hover:shadow-lg rounded-xl",
                  };

                  switch (item.type) {
                    case "post":
                      const post: Post = item.data as Post;
                      return (
                        <PostSearchItem
                          {...itemProps}
                          key={post.pid}
                          post={post}
                        />
                      );
                    case "folder":
                      const folder: Folder = item.data as Folder;
                      return (
                        <FolderSearchItem
                          {...itemProps}
                          key={folder.id}
                          folder={folder}
                        />
                      );
                    case "user":
                      const user: User = item.data as User;
                      return (
                        <UserSearchItem
                          {...itemProps}
                          key={user.id}
                          user={user}
                        />
                      );
                    default:
                      return (
                        <div
                          key={index}
                          className="p-4 bg-red-50 rounded-xl border border-red-200"
                        >
                          <p className="text-red-600 font-medium">
                            Error loading this item
                          </p>
                        </div>
                      );
                  }
                }
              )}
            </div>
          </div>
        </section>

        {/* Modern Pagination Footer */}
        {data && data.data.total > 0 && (
          <footer className="bg-gray-50/80 backdrop-blur-sm border-t border-gray-200/50 px-6 py-4">
            <div className="flex items-center justify-between">
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
                className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 disabled:bg-gray-100 border border-gray-200 rounded-xl transition-all duration-200 disabled:opacity-50"
                icon={`${PrimeIcons.CHEVRON_LEFT} text-gray-600`}
              >
                <span className="text-gray-700 font-medium">Previous</span>
              </Button>

              <div className="flex items-center gap-4">
                <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-xl font-semibold text-sm">
                  Page {Math.floor((query.skip ?? 0) / (query.take ?? 5)) + 1}
                </span>
                <span className="text-gray-500 text-sm">of</span>
                <span className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-semibold text-sm">
                  {data ? Math.ceil(data.data.total / (query.take ?? 5)) : 1}
                </span>
              </div>

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
                className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 disabled:bg-gray-100 border border-gray-200 rounded-xl transition-all duration-200 disabled:opacity-50"
              >
                <span className="text-gray-700 font-medium">Next</span>
                <i className={`${PrimeIcons.CHEVRON_RIGHT} text-gray-600`}></i>
              </Button>
            </div>
          </footer>
        )}
      </div>
    </div>
  );
};

export default SearchContainer;
