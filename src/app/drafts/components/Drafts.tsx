"use client";
import { decodeUserData } from "@/app/functions/functions";
import { Query } from "@/app/types/types";
import { getDraftsByUserId } from "@/app/utils/service/userService";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";

const Drafts = () => {
  const [userId, setUserID] = useState<number>(-1);
  const [query, setQuery] = useState<Query>({ search: "", skip: 0, take: 10 });

  const { data } = useQuery({
    queryKey: [`user-${userId}-drafts-${JSON.stringify(query)}`],
    queryFn: () => getDraftsByUserId(userId, query),
    enabled: !!userId && userId !== -1,
  });

  useEffect(() => {
    const extractUser = async () => {
      const id = decodeUserData()?.sub;

      if (id) setUserID(id);
    };

    extractUser();
  }, []);

  useEffect(() => {
    console.log(data?.data);
  }, [data]);

  return (
    <div className="w-full h-[86vh] overflow-y-auto pt-4">
      <h4 className="font-medium text-blue-600 text-lg">Drafts</h4>
    </div>
  );
};

export default Drafts;
