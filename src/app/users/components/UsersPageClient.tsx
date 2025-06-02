"use client";
import { Query } from "@/app/types/types";
import { findUsers } from "@/app/utils/service/userService";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";

const UsersPageClient = () => {
  const [query] = useState<Query>({ search: "" });

  const { data } = useQuery({
    queryKey: [`users-${JSON.stringify(query)}`],
    queryFn: () => findUsers(query),
  });

  return (
    <div className="w-full h-[86vh] overflow-y-auto">
      {JSON.stringify(data?.data.users)}
    </div>
  );
};

export default UsersPageClient;
