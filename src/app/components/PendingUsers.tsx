"use client";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import React from "react";
import { fetchPendingUsers } from "../functions/functions";

const PendingUsers = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["pending-users"],
    queryFn: fetchPendingUsers,
  });

  if (isError) console.log(error);

  return (
    <Link
      href={"/pending"}
      className="relative h-10 w-10 cursor-pointer grid place-content-center hover:bg-neutral-300 rounded dark:hover:bg-neutral-700"
    >
      <Icon icon={"gravity-ui:person"} className="h-7 w-7" />
      <p className="absolute bottom-0 right-0 h-4 w-4 grid place-content-center font-extrabold bg-black dark:bg-white text-white rounded-full dark:text-black text-[10px]">
        {isLoading ? <Icon icon={"line-md:loading-loop"} /> : data?.length}
      </p>
    </Link>
  );
};

export default PendingUsers;
