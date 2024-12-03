"use client";
import { decodeUserData } from "@/app/functions/functions";
import { toastClass } from "@/app/tailwind-classes/tw_classes";
import { QmType } from "@/app/types/types";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Folder from "./Folder";

const QmPortal = () => {
  const router = useRouter();
  const [selectedFolder, setSelectedFolder] = useState<QmType | undefined>();
  const dummyData: QmType[] = [
    {
      folderName: "Human Resource",
      icon: "mynaui:folder-two",
      folderItems: [
        {
          folderName: "Forms",
          folderItems: [{ name: "Subitem", imageLocation: "/abc2" }],
          icon: "mynaui:folder-two",
        },
        {
          folderName: "Procedures",
          folderItems: [{ name: "Subitem", imageLocation: "/abc2" }],
          icon: "mynaui:folder-two",
        },
        {
          folderName: "Policies",
          folderItems: [{ name: "Subitem", imageLocation: "/abc2" }],
          icon: "mynaui:folder-two",
        },
      ],
    },
    {
      folderName: "Quality Management",
      icon: "mynaui:folder-two",
      folderItems: [
        {
          folderName: "Forms",
          folderItems: [{ name: "Subitem", imageLocation: "/abc2" }],
          icon: "mynaui:folder-two",
        },
        {
          folderName: "Procedures",
          folderItems: [{ name: "Subitem", imageLocation: "/abc2" }],
          icon: "mynaui:folder-two",
        },
        {
          folderName: "Policies",
          folderItems: [{ name: "Subitem", imageLocation: "/abc2" }],
          icon: "mynaui:folder-two",
        },
      ],
    },
    {
      folderName: "Information Technology",
      icon: "mynaui:folder-two",
      folderItems: [
        {
          folderName: "Forms",
          folderItems: [{ name: "Subitem", imageLocation: "/abc2" }],
          icon: "mynaui:folder-two",
        },
        {
          folderName: "Procedures",
          folderItems: [{ name: "Subitem", imageLocation: "/abc2" }],
          icon: "mynaui:folder-two",
        },
        {
          folderName: "Policies",
          folderItems: [{ name: "Subitem", imageLocation: "/abc2" }],
          icon: "mynaui:folder-two",
        },
      ],
    },
    {
      folderName: "Nursing",
      icon: "mynaui:folder-two",
      folderItems: [
        {
          folderName: "Forms",
          folderItems: [{ name: "Subitem", imageLocation: "/abc2" }],
          icon: "mynaui:folder-two",
        },
        {
          folderName: "Procedures",
          folderItems: [{ name: "Subitem", imageLocation: "/abc2" }],
          icon: "mynaui:folder-two",
        },
        {
          folderName: "Policies",
          folderItems: [{ name: "Subitem", imageLocation: "/abc2" }],
          icon: "mynaui:folder-two",
        },
      ],
    },
    {
      folderName: "Credit and Collection",
      icon: "mynaui:folder-two",
      folderItems: [
        {
          folderName: "Forms",
          folderItems: [{ name: "Subitem", imageLocation: "/abc2" }],
          icon: "mynaui:folder-two",
        },
        {
          folderName: "Procedures",
          folderItems: [{ name: "Subitem", imageLocation: "/abc2" }],
          icon: "mynaui:folder-two",
        },
        {
          folderName: "Policies",
          folderItems: [{ name: "Subitem", imageLocation: "/abc2" }],
          icon: "mynaui:folder-two",
        },
      ],
    },
    {
      folderName: "Accounting",
      icon: "mynaui:folder-two",
      folderItems: [
        {
          folderName: "Forms",
          folderItems: [{ name: "Subitem", imageLocation: "/abc2" }],
          icon: "mynaui:folder-two",
        },
        {
          folderName: "Procedures",
          folderItems: [{ name: "Subitem", imageLocation: "/abc2" }],
          icon: "mynaui:folder-two",
        },
        {
          folderName: "Policies",
          folderItems: [{ name: "Subitem", imageLocation: "/abc2" }],
          icon: "mynaui:folder-two",
        },
      ],
    },
    {
      folderName: "Marketing",
      icon: "mynaui:folder-two",
      folderItems: [
        {
          folderName: "Forms",
          folderItems: [{ name: "Subitem", imageLocation: "/abc2" }],
          icon: "mynaui:folder-two",
        },
        {
          folderName: "Procedures",
          folderItems: [{ name: "Subitem", imageLocation: "/abc2" }],
          icon: "mynaui:folder-two",
        },
        {
          folderName: "Policies",
          folderItems: [{ name: "Subitem", imageLocation: "/abc2" }],
          icon: "mynaui:folder-two",
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
        {selectedFolder ? (
          <div className="overflow-auto w-full flex flex-col">
            {selectedFolder.folderItems.map((subFolder, index) => (
              <Folder
                key={index}
                data={subFolder}
                setSelectedFolder={setSelectedFolder}
              />
            ))}
          </div>
        ) : (
          <>
            <div className="overflow-auto w-full flex flex-col">
              {dummyData.map((data, index) => (
                <Folder
                  data={data}
                  setSelectedFolder={setSelectedFolder}
                  key={index}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default QmPortal;
