"use client";
import { decodeUserData } from "@/app/functions/functions";
import { toastClass } from "@/app/tailwind-classes/tw_classes";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { toast } from "react-toastify";

const QmPortal = () => {
  const router = useRouter();

  useEffect(() => {
    const checkQm = () => {
      const lid = decodeUserData()?.lid;

      if (lid && lid !== 2) {
        toast("You are unauthorized to access this page", {
          className: toastClass,
          type: "error",
        });

        router.push("/");
      }
    };

    checkQm();
  }, [router]);

  return (
    <div className="grid place-content-center h-[90vh]">
      <div className="flex flex-col items-center gap-4">
        <Icon icon={"emojione-monotone:stop-sign"} className="h-10 w-10" />
        <p className="font-semibold text-xl">Underdevelopment</p>
      </div>
    </div>
  );
};

export default QmPortal;
