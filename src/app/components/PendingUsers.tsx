"use client";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import React, { useEffect } from "react";
import { fetchPendingUsers } from "../functions/functions";
import useSignalStore from "../store/signalStore";

const PendingUsers = () => {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["pending-users"],
    queryFn: fetchPendingUsers,
  });

  const { signal, setSignal } = useSignalStore();

  useEffect(() => {
    refetch();
    setSignal(false);
  }, [signal, setSignal, refetch]);

  if (isError) console.error(error);

  return (
    <Link
      href={"/pending"}
      className="relative h-1 w-1 cursor-pointer grid place-content-center hover:bg-neutral-300 rounded dark:hover:bg-neutral-700"
    >
      <Icon icon={"gravity-ui:person"} className="h-7 w-7" />
      <p className="absolute -bottom-4 -right-4 h-4 w-4 grid place-content-center font-extrabold bg-black dark:bg-white text-white rounded-full dark:text-black text-[10px]">
        {isLoading ? <Icon icon={"line-md:loading-loop"} /> : data?.length}
      </p>
    </Link>
  );
};

export default PendingUsers;
