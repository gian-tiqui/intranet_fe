"use client";
import useComments from "@/app/custom-hooks/comments";
import { useState, useEffect, ChangeEvent } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import Searchbar from "@/app/components/Searchbar";
import { PostComment } from "@/app/types/types";
import ModeToggler from "@/app/components/ModeToggler";

const Comments = () => {
  const comments = useComments();
  const [sortedComments, setSortedComments] = useState<PostComment[]>([]);
  const [page, setPage] = useState<number>(1);
  const [direction, setDirection] = useState<string>("asc");
  const [selectedField, setSelectedField] = useState<string>("");
  const [loadingSearch, setLoadingSearch] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");

  const JUMP = 4;
  const [minMax, setMinMax] = useState<{ min: number; max: number }>({
    min: 0,
    max: 4,
  });

  const heads = [
    { head: "MESSAGE", field: "message" },
    { head: "USER", field: "user.firstName" },
    { head: "POST ID", field: "postId" },
    { head: "CREATED AT", field: "createdAt" },
    { head: "UPDATED AT", field: "updatedAt" },
  ];

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setDebouncedSearch(searchText);
      setLoadingSearch(true);
    }, 1000);

    return () => clearTimeout(delayDebounceFn);
  }, [searchText]);

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
  };

  // Filter and sort comments based on search
  useEffect(() => {
    const searchComments = () => {
      const searchTerm = debouncedSearch.toLowerCase().trim();
      const filteredComments = comments.filter((comment) => {
        return comment.message?.toLowerCase().includes(searchTerm);
      });
      setSortedComments(filteredComments);
    };
    searchComments();
  }, [debouncedSearch, comments]);

  const handleSortClicked = (field: string) => {
    if (selectedField === field) {
      setDirection(direction === "asc" ? "desc" : "asc");
    } else {
      setDirection("asc");
    }
    setSelectedField(field);
  };

  useEffect(() => {
    const sortComments = () => {
      const sorted = [...comments].sort((a, b) => {
        let valueA, valueB;
        switch (selectedField) {
          case "message":
            valueA = a.message?.toLowerCase();
            valueB = b.message?.toLowerCase();
            break;
          case "user.firstName":
            valueA = a.user.firstName?.toLowerCase();
            valueB = b.user.firstName?.toLowerCase();
            break;
          case "postId":
            valueA = a.postId;
            valueB = b.postId;
            break;
          case "createdAt":
            valueA = new Date(a.createdAt).getTime();
            valueB = new Date(b.createdAt).getTime();
            break;
          case "updatedAt":
            valueA = new Date(a.updatedAt).getTime();
            valueB = new Date(b.updatedAt).getTime();
            break;
          default:
            return 0;
        }

        if (valueA && valueB) {
          if (valueA < valueB) return direction === "asc" ? -1 : 1;
          if (valueA > valueB) return direction === "asc" ? 1 : -1;
        }
        return 0;
      });
      setSortedComments(sorted);
    };
    sortComments();
  }, [selectedField, direction, comments]);

  const handleNextClicked = () => {
    if (minMax.max <= comments.length - 1) {
      setMinMax((prevState) => ({
        min: prevState.min + JUMP,
        max: prevState.max + JUMP,
      }));
      setPage((prevPage) => prevPage + 1);
    }
  };

  const handlePrevClicked = () => {
    if (minMax.min > 0) {
      setMinMax((prevState) => ({
        min: prevState.min - JUMP,
        max: prevState.max - JUMP,
      }));
      setPage((prevPage) => prevPage - 1);
    }
  };

  return (
    <div className="comments-component">
      <div className="w-full bg-inherit py-5 px-10 shadow flex items-center justify-between">
        <h1 className="text-2xl font-extrabold">Comments</h1>

        <div className="flex items-center gap-3">
          <Searchbar
            loading={loadingSearch}
            handleSearchChange={handleSearchChange}
            searchText={searchText}
          />
          <ModeToggler />
        </div>
      </div>

      <div className="p-10">
        <div className="border border-gray-300 dark:border-neutral-900 pb-5 rounded-xl shadow">
          <table className="min-w-full border-b bg-inherit min-h-96 overflow-x-auto">
            <thead className="dark:text-white border-b border-gray-300 dark:border-neutral-900 uppercase text-sm">
              <tr>
                {heads.map((head, index) => (
                  <th className="py-3 px-4" key={index}>
                    <div className="flex items-center justify-center gap-2">
                      <p>{head.head}</p>
                      <Icon
                        onClick={() => handleSortClicked(head.field)}
                        icon={"bx:sort"}
                        className={`${
                          selectedField === head.field && "rotate-45"
                        } ${
                          direction === "desc" &&
                          selectedField === head.field &&
                          "-rotate-45"
                        } cursor-pointer p-1 rounded-full hover:bg-gray-300 dark:hover:bg-neutral-700 h-6 w-6`}
                      />
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="align-top">
              {sortedComments.length > 0 ? (
                sortedComments.slice(minMax.min, minMax.max).map((comment) => (
                  <tr key={comment.cid}>
                    <td className="py-3 px-4">{comment.message}</td>
                    <td className="py-3 px-4">
                      {comment.user.firstName} {comment.user.lastName}
                    </td>
                    <td className="py-3 px-4">{comment.postId}</td>
                    <td className="py-3 px-4">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      {new Date(comment.updatedAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={heads.length}
                    className="text-center p-10 text-gray-500"
                  >
                    No comments found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <div className="flex mx-6 gap-5 mt-5 justify-between">
            <p>Page {page}</p>
            <div className="flex gap-3">
              <button onClick={handlePrevClicked}>
                <Icon
                  icon={"grommet-icons:link-previous"}
                  className="h-7 hover:bg-gray-300 rounded-full dark:hover:bg-neutral-600 p-1 w-7"
                />
              </button>
              <button onClick={handleNextClicked}>
                <Icon
                  icon={"grommet-icons:link-next"}
                  className="h-7 hover:bg-gray-300 dark:hover:bg-neutral-600 rounded-full p-1 w-7"
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Comments;
