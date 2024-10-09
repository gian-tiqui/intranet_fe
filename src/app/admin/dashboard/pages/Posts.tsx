"use client";
import { API_BASE, INTRANET } from "@/app/bindings/binding";
import ModeToggler from "@/app/components/ModeToggler";
import Searchbar from "@/app/components/Searchbar";
import apiClient from "@/app/http-common/apiUrl";
import { MinMax, ThType, Post } from "@/app/types/types";
import { Icon } from "@iconify/react/dist/iconify.js";
import { formatDate } from "date-fns";
import React, { ChangeEvent, useEffect, useState } from "react";

const Posts = () => {
  const [posts, setPosts] = useState<Post[]>([]);

  const [sortedPosts, setSortedPosts] = useState<Post[]>([]);
  const [page, setPage] = useState<number>(1);
  const [direction, setDirection] = useState<string>("asc");
  const [selectedField, setSelectedField] = useState<string>("");
  const [loadingSearch, setLoadingSearch] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");
  const [selectedDept, setSelectedDept] = useState<string>("");

  const JUMP = 4;
  const [minMax, setMinMax] = useState<MinMax>({ min: 0, max: 4 });
  const heads: ThType[] = [
    { head: "TITLE", field: "title" },
    { head: "MESSAGE", field: "message" },
    { head: "POSTED BY", field: "user.firstName" },
    { head: "DEPARTMENT", field: "deptId" },
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
    const { value } = event.target;
    setSearchText(value);
  };

  const departments: { field: string; deptName: string }[] = [
    { deptName: "ALL", field: "" },
    { deptName: "IT", field: "it" },
    { deptName: "HR", field: "hr" },
    { deptName: "QM", field: "qm" },
    { deptName: "ACNT", field: "accounting" },
    { deptName: "ADM", field: "admitting" },
    { deptName: "MRKTG", field: "marketing" },
    { deptName: "PRCHS", field: "purchasing" },
  ];

  const handleNextClicked = () => {
    if (minMax.max <= posts.length - 1) {
      setMinMax((prevState) => ({
        min: prevState.min + JUMP,
        max: prevState.max + JUMP,
      }));
      setPage((prevNum) => prevNum + 1);
    }
  };

  const handlePrevClicked = () => {
    if (minMax.min > 0) {
      setMinMax((prevState) => ({
        min: prevState.min - JUMP,
        max: prevState.max - JUMP,
      }));
      setPage((prevNum) => prevNum - 1);
    }
  };

  const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedDept(e.target.value);
  };

  useEffect(() => {
    if (selectedDept === "") {
      setSortedPosts(posts);
    } else {
      const postsByDept = posts.filter(
        (post) => post.department.departmentName.toLowerCase() === selectedDept
      );
      setSortedPosts(postsByDept);
    }
  }, [selectedDept, posts]);

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await apiClient.get(`${API_BASE}/post`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem(INTRANET)}`,
        },
      });

      setPosts(response.data);
      setSortedPosts(response.data);
    };

    fetchPosts();
  }, []);

  useEffect(() => {
    const searchPosts = () => {
      const searchTerm = debouncedSearch.toLowerCase().trim();
      const postsSearchResults = posts.filter((post) => {
        return (
          post.title?.toLowerCase().includes(searchTerm) ||
          post.message?.toLowerCase().includes(searchTerm)
        );
      });

      setSortedPosts(postsSearchResults);
    };

    searchPosts();
  }, [debouncedSearch, posts]);

  const handleSortClicked = (field: string) => {
    if (selectedField === field) {
      setDirection(direction === "asc" ? "desc" : "asc");
    } else {
      setDirection("asc");
    }
    setSelectedField(field);
  };

  useEffect(() => {
    const sortPosts = () => {
      const sorted = [...posts].sort((a, b) => {
        let valueA, valueB;

        switch (selectedField) {
          case "title":
            valueA = a.title?.toLowerCase();
            valueB = b.title?.toLowerCase();
            break;
          case "message":
            valueA = a.message?.toLowerCase();
            valueB = b.message?.toLowerCase();
            break;
          case "user.firstName":
            valueA = a.user?.firstName?.toLowerCase();
            valueB = b.user?.firstName?.toLowerCase();
            break;
          case "deptId":
            valueA = a.deptId;
            valueB = b.deptId;
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
          if (valueA < valueB) {
            return direction === "asc" ? -1 : 1;
          }
          if (valueA > valueB) {
            return direction === "asc" ? 1 : -1;
          }
        }

        return 0;
      });

      setSortedPosts(sorted);
    };

    sortPosts();
  }, [selectedField, direction, posts]);

  return (
    <div className="posts-component">
      <div className="w-full bg-inherit py-5 px-10 shadow flex flex-row-reverse">
        <div className="flex gap-3 items-center">
          <Searchbar
            loading={loadingSearch}
            handleSearchChange={handleSearchChange}
            searchText={searchText}
          />
          <ModeToggler />
        </div>
      </div>

      <div className="p-10">
        <div className="flex justify-between border border-b-gray-300 border-x-gray-300 dark:border-neutral-900 rounded-t-xl pt-5">
          <h1 className="px-9 mb-6">
            <p className="text-2xl font-extrabold">Posts</p>
          </h1>
          <select
            onChange={handleSelectChange}
            className="bg-gray-300 dark:bg-neutral-700 border outline-none rounded-full border-gray-400 dark:border-neutral-900 text-center me-5 w-24 cursor-pointer h-10"
          >
            {departments.map((dept, index) => (
              <option value={dept.field} key={index}>
                {dept.deptName}
              </option>
            ))}
          </select>
        </div>
        <div className="border border-gray-300 dark:border-neutral-900 pb-5 rounded-b-xl shadow">
          <table className="min-w-full border-b bg-inherit min-h-96 overflow-x-auto">
            <thead className="bg-inherit dark:text-white border-b border-gray-300 dark:border-neutral-900 uppercase text-sm">
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
                <th className="py-3 px-4">ACTION</th>
              </tr>
            </thead>
            <tbody className="align-top">
              {sortedPosts.length > 0 ? (
                sortedPosts.slice(minMax.min, minMax.max).map((post) => (
                  <tr
                    key={post.pid}
                    className="border-b last:border-b-0 border-gray-300 dark:border-neutral-900"
                  >
                    <td className="text-center">{post.title}</td>
                    <td className="text-center break-all">{post.message}</td>
                    <td className="text-center">
                      {post.user?.firstName} {post.user?.lastName}
                    </td>
                    <td className="text-center">
                      {post.department.departmentName}
                    </td>
                    <td className="text-center">
                      {formatDate(post.createdAt, "MMMM dd, yyyy")}
                    </td>
                    <td className="text-center">
                      {formatDate(post.updatedAt, "MMMM dd, yyyy")}
                    </td>
                    <td
                      onClick={() => console.log(post.pid)}
                      className="py-4 px-4 border-b border-gray-300 dark:border-neutral-900
                   text-center"
                    >
                      <Icon
                        icon={"simple-line-icons:options"}
                        className="mx-auto h-7 w-7 p-1 cursor-pointer hover:bg-gray-300 dark:hover:bg-neutral-600 rounded-full"
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={heads.length + 1}
                    className="text-center p-10 text-gray-500"
                  >
                    No posts found.
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
                  className="h-7 hover:bg-gray-300 rounded-full dark:hover:bg-neutral-600  p-1 w-7"
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

export default Posts;
