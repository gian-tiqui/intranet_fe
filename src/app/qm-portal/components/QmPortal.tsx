"use client";
import { decodeUserData } from "@/app/functions/functions";
import { toastClass } from "@/app/tailwind-classes/tw_classes";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { toast } from "react-toastify";

type QmType = {
  folderName: string;
  folderItems: { imageLocation: string; name: string }[] | QmType[];
};

const QmPortal = () => {
  const router = useRouter();
  const dummyData: QmType[] = [
    {
      folderName: "Forms",
      folderItems: [
        {
          folderName: "Subfolder",
          folderItems: [{ name: "Subitem", imageLocation: "/abc2" }],
        },
        {
          folderName: "Subfolder",
          folderItems: [{ name: "Subitem", imageLocation: "/abc2" }],
        },
      ],
    },
    {
      folderName: "Procedures",
      folderItems: [
        {
          folderName: "Subfolder",
          folderItems: [{ name: "Subitem", imageLocation: "/abc2" }],
        },
        {
          folderName: "Subfolder",
          folderItems: [{ name: "Subitem", imageLocation: "/abc2" }],
        },
      ],
    },
    {
      folderName: "Policies",
      folderItems: [
        {
          folderName: "Subfolder",
          folderItems: [{ name: "Subitem", imageLocation: "/abc2" }],
        },
        {
          folderName: "Subfolder",
          folderItems: [{ name: "Subitem", imageLocation: "/abc2" }],
        },
      ],
    },
  ];

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
    <div className="h-[90vh]">
      <p className="font-bold mb-5 text-xl">Quality Management Portal</p>
      <div className="p-4 bg-white dark:bg-neutral-900 rounded h-[70vh] overflow-auto">
        <div className="flex items-center justify-between gap-1 mb-4">
          <div className="flex items-center gap-1">
            <p className="text-sm mb-2 font-semibold">Name</p>
            <Icon icon={"fluent:arrow-down-24-filled"} className="-rotate-45" />
          </div>
          <div className="">
            <Icon icon={"hugeicons:folder-add"} className="h-5 w-5" />
          </div>
        </div>
        <div className="overflow-auto w-full flex flex-col">
          {dummyData.map((data, index) => (
            <div
              key={index}
              className="flex flex-col w-full px-3 cursor-default "
            >
              <div
                onDoubleClick={() => console.log(data)}
                className="flex justify-between items-center hover:bg-gray-100 dark:hover:bg-neutral-700 px-3"
              >
                <div className="flex items-center gap-3 py-3">
                  <Icon icon={"hugeicons:note"} className="h-7 w-7" />
                  <p className="font-semibold text-sm">{data.folderName}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-800">
                    <Icon
                      icon={"material-symbols:download"}
                      className="h-6 w-6"
                    />
                  </div>
                  <div className="p-2 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-800">
                    <Icon
                      icon={"material-symbols:delete-outline"}
                      className="h-6 w-6"
                    />{" "}
                  </div>
                </div>
              </div>

              <hr className="w-full border-b-0 border-black dark:border-white" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QmPortal;
