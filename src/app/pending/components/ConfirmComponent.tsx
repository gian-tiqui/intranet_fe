"use client";
import { INTRANET } from "@/app/bindings/binding";
import { fetchPendingUsers } from "@/app/functions/functions";
import { toastClass } from "@/app/tailwind-classes/tw_classes";
import { useQuery } from "@tanstack/react-query";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { toast } from "react-toastify";
import UserList from "./UserList";

const ConfirmComponent = () => {
  const router = useRouter();
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["pending-users"],
    queryFn: fetchPendingUsers,
  });

  const onRefetch = () => {
    refetch();
  };

  useEffect(() => {
    const at = localStorage.getItem(INTRANET);

    const checkLevel = () => {
      if (!at) return;

      const decoded: { lid: number } = jwtDecode(at);

      if (decoded.lid < 2) {
        toast("You are not authorized to view this page.", {
          className: toastClass,
          type: "error",
        });
        router.push("/");
      }
    };

    checkLevel();
  }, [router]);

  if (isError) console.error(error);

  if (isLoading) return <p>Loading...</p>;

  return (
    <div>
      <div className="p-5">
        <h1 className="text-xl font-bold text-blue-600">
          Users to be approved
        </h1>
      </div>
      <div className="p-5">
        {data && data?.length > 0 ? (
          <UserList pendingUsers={data} onRefetch={onRefetch} />
        ) : (
          <p className="text-center mt-10 font-semibold">
            No users at the moment
          </p>
        )}
      </div>
    </div>
  );
};

export default ConfirmComponent;
