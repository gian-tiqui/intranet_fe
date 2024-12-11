"use client";
import { decodeUserData, fetchMainFolders } from "@/app/functions/functions";
import { toastClass } from "@/app/tailwind-classes/tw_classes";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { toast } from "react-toastify";
import Folder from "./Folder";
import useFolderStore from "@/app/store/useFolderStore";
import { useQuery } from "@tanstack/react-query";
import LocationComp from "./LocationComp";
import useSignalStore from "@/app/store/signalStore";
import useOpenCreateFolderMainStore from "@/app/store/createMainFolder";

const QmPortal = () => {
  const router = useRouter();
  const { selectedFolder, setSelectedFolder } = useFolderStore();
  const { signal, setSignal } = useSignalStore();
  const { setOpenCreateFolderModal } = useOpenCreateFolderMainStore();

  useEffect(() => {
    setSelectedFolder(undefined);
  }, [setSelectedFolder]);

  const {
    data: folders,
    error,
    isError,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["main-folder"],
    queryFn: fetchMainFolders,
  });

  useEffect(() => {
    const updateFolder = () => {
      refetch();

      setSignal(false);
    };

    updateFolder();
  }, [signal, setSignal, refetch]);

  useEffect(() => {
    const checkQm = () => {
      const deptId = decodeUserData()?.deptId;

      if (deptId && deptId !== 2) {
        toast("You are unauthorized to access this page", {
          className: toastClass,
          type: "error",
        });

        router.push("/");
      }
    };

    checkQm();
  }, [router]);

  if (isLoading)
    return (
      <div>
        <p>Loading folders...</p>
      </div>
    );

  if (isError) console.log(error);

  return (
    <div className="h-[90vh]">
      <p className="font-bold mb-5 text-xl">Quality Management Portal</p>
      <div className="p-4 bg-white dark:bg-neutral-900 rounded h-[70vh]">
        <div className="flex items-center justify-between gap-1 mb-4">
          <div className="flex items-center gap-1">
            <p className="text-sm mb-2 font-semibold">Name</p>
            <Icon icon={"fluent:arrow-down-24-filled"} className="-rotate-45" />
          </div>

          <div
            onClick={() => setOpenCreateFolderModal(true)}
            className="hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded p-1"
          >
            <Icon icon={"hugeicons:folder-add"} className="h-5 w-5" />
          </div>
        </div>

        <LocationComp name={selectedFolder?.name} />

        <div className="overflow-auto w-full flex flex-col h-[52vh]">
          {folders &&
            folders.map((data, index) => (
              <Folder
                data={data}
                setSelectedFolder={setSelectedFolder}
                key={index}
              />
            ))}
        </div>
      </div>
    </div>
  );
};

export default QmPortal;
