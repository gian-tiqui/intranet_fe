"use client";
import useHistory from "@/app/custom-hooks/history";
import React, { useEffect } from "react";
import HistoryList from "./HistoryList";
import { useQuery } from "@tanstack/react-query";
import useHideSearchBarStore from "@/app/store/hideSearchBar";
import usePostUriStore from "@/app/store/usePostUri";

const HistoryMain = () => {
  const { data, isError, isLoading, refetch } = useQuery({
    queryKey: ["history"],
    queryFn: useHistory,
  });

  const { uriPost } = usePostUriStore();

  const { setSearchBarHidden } = useHideSearchBarStore();

  useEffect(() => {
    refetch();
  }, [refetch, uriPost]);

  useEffect(() => {
    setSearchBarHidden(true);
    return () => setSearchBarHidden(false);
  }, [setSearchBarHidden]);

  if (isError) {
    return <p>Error loading data</p>;
  }

  if (isLoading) {
    return <p>Loading data</p>;
  }

  return <div>{data && <HistoryList history={data} />}</div>;
};

export default HistoryMain;
