"use client";
import { API_BASE, INTRANET } from "@/app/bindings/binding";
import ModeToggler from "@/app/components/ModeToggler";
import Searchbar from "@/app/components/Searchbar";
import apiClient from "@/app/http-common/apiUrl";
import { MinMax, ThType, User } from "@/app/types/types";
import { Icon } from "@iconify/react/dist/iconify.js";
import { formatDate } from "date-fns";
import React, { ChangeEvent, useEffect, useState } from "react";

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [sortedUsers, setSortedUsers] = useState<User[]>([]);
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
    { head: "FIRST NAME", field: "firstname" },
    { head: "MIDDLE NAME", field: "middlename" },
    { head: "LAST NAME", field: "lastname" },
    { head: "EMAIL", field: "email" },
    { head: "DEPARTMENT", field: "department" },
    { head: "DOB", field: "dob" },
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
    if (minMax.max <= users.length - 1) {
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
      setSortedUsers(users);
    } else {
      const usersByDept = users.filter(
        (user) =>
          user.department.departmentName.toLowerCase() ===
          selectedDept.toLowerCase()
      );
      setSortedUsers(usersByDept);
    }
  }, [selectedDept, users]);

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await apiClient.get(`${API_BASE}/users`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem(INTRANET)}`,
        },
      });

      setUsers(response.data.users.users);
      setSortedUsers(response.data.users.users);
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setDebouncedSearch(searchText);
      setLoadingSearch(true);
    }, 1000);

    return () => clearTimeout(delayDebounceFn);
  }, [searchText]);

  const handleSortClicked = (field: string) => {
    if (selectedField === field) {
      setDirection(direction === "asc" ? "desc" : "asc");
    } else {
      setDirection("asc");
    }
    setSelectedField(field);
  };

  useEffect(() => {
    const searchUsers = () => {
      const searchTerm = debouncedSearch.toLowerCase().trim();
      const usersSearchResults = users.filter((user) => {
        const fullName = `${user.firstName} ${user.middleName} ${user.lastName}`
          .toLowerCase()
          .trim();
        return fullName.includes(searchTerm);
      });

      setSortedUsers(usersSearchResults);
    };

    searchUsers();
  }, [debouncedSearch, users]);

  useEffect(() => {
    const sortUsers = () => {
      const sorted = [...users].sort((a, b) => {
        let valueA, valueB;

        switch (selectedField) {
          case "firstname":
            valueA = a.firstName.toLowerCase();
            valueB = b.firstName.toLowerCase();
            break;
          case "middlename":
            valueA = a.middleName?.toLowerCase();
            valueB = b.middleName?.toLowerCase();
            break;
          case "lastname":
            valueA = a.lastName.toLowerCase();
            valueB = b.lastName.toLowerCase();
            break;
          case "email":
            valueA = a.email.toLowerCase();
            valueB = b.email.toLowerCase();
            break;
          case "department":
            valueA = a.department.departmentName.toLowerCase();
            valueB = b.department.departmentName.toLowerCase();
            break;
          case "dob":
            valueA = new Date(a.dob).getTime();
            valueB = new Date(b.dob).getTime();
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

      setSortedUsers(sorted);
    };

    sortUsers();
  }, [selectedField, direction, users]);

  return (
    <div className="users-component">
      <div className="w-full  bg-inherit py-5 px-10 shadow flex flex-row-reverse">
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
        <div
          className="flex justify-between border border-b-gray-300 border-x-gray-300 dark:border-neutral-900
         rounded-t-xl pt-5"
        >
          <h1 className="px-9 mb-6">
            <p className="text-2xl font-extrabold">Users</p>
          </h1>
          <select
            onChange={handleSelectChange}
            className="bg-gray-400 dark:bg-neutral-700 border outline-none rounded-full border-gray-400 dark:border-neutral-900 text-center me-5 w-24 cursor-pointer h-10"
          >
            {departments.map((dept, index) => (
              <option
                value={dept.field}
                key={index}
                className="bg-gray-300 dark:bg-neutral-700 grid place-content-center"
              >
                {dept.deptName}
              </option>
            ))}
          </select>
        </div>
        <div
          className="border border-gray-300 dark:border-neutral-900
         pb-5 rounded-b-xl shadow"
        >
          <table className="min-w-full bg-inherit  min-h-96">
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
              {sortedUsers.length > 0 ? (
                sortedUsers.slice(minMax.min, minMax.max).map((user) => (
                  <tr key={user.id} className="">
                    <td
                      className="py-4 px-4 border-b border-gray-300 dark:border-neutral-900
                   text-center"
                    >
                      {user.firstName}
                    </td>
                    <td
                      className="py-4 px-4 border-b border-gray-300 dark:border-neutral-900
                   text-center"
                    >
                      {user.middleName}
                    </td>
                    <td
                      className="py-4 px-4 border-b border-gray-300 dark:border-neutral-900
                   text-center"
                    >
                      {user.lastName}
                    </td>
                    <td
                      className="py-4 px-4 border-b border-gray-300 dark:border-neutral-900
                   text-center"
                    >
                      {user.email}
                    </td>
                    <td
                      className="py-4 px-4 border-b border-gray-300 dark:border-neutral-900
                   text-center"
                    >
                      {user.department.departmentName}
                    </td>
                    <td
                      className="py-4 px-4 border-b border-gray-300 dark:border-neutral-900
                   text-center"
                    >
                      {" "}
                       {formatDate(user.dob, "MMMM dd, yyyy")}
                    </td>
                    <td
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
                <p className="ms-5 font-bold mt-3">No users found</p>
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

export default Users;
