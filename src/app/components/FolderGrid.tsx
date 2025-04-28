import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useRef, useState } from "react";
import { checkDept, fetchMainFolders } from "../functions/functions";
import { Query } from "../types/types";
import useSignalStore from "../store/signalStore";
import { Button } from "primereact/button";
import { PrimeIcons } from "primereact/api";
import FolderContentDialog from "./FolderContentDialog";
import AddFolderDialog from "./AddFolderDialog";
import { OverlayPanel } from "primereact/overlaypanel";
import FolderGridSkeleton from "./FolderGridSkeleton";
import EditFolderDialog from "./EditFolderDialog";
import { confirmDialog } from "primereact/confirmdialog";
import { deleteFolder } from "../utils/service/folderService";
import CustomToast from "./CustomToast";
import { Toast } from "primereact/toast";
import SearchV2 from "./SearchV2";
import { Image } from "primereact/image";
import folderImg from "../assets/blue-folder.png";

const FolderGrid = () => {
  const [query, setQuery] = useState<Query>({
    search: "",
    skip: 0,
    take: 50,
    includeSubfolders: 0,
  });
  const [searchTerm, setSearchTerm] = useState<string>("");
  const { signal, setSignal } = useSignalStore();
  const [folderId, setFolderId] = useState<number>();
  const [editFolderId, setEditFolderId] = useState<number>();
  const [editFolderDialogVisible, setEditFolderDialogVisible] =
    useState<boolean>(false);
  const [folderDialogVisible, setFolderDialogVisible] =
    useState<boolean>(false);
  const [addFolderDialogVisible, setAddFolderDialogVisible] =
    useState<boolean>(false);
  const toastRef = useRef<Toast>(null);

  const { data, isLoading, refetch } = useQuery({
    queryKey: [`folders-grid`],
    queryFn: () => fetchMainFolders(query),
  });

  useEffect(() => {
    const handler = setTimeout(() => {
      setQuery((prev) => ({ ...prev, search: searchTerm }));
    }, 700);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  useEffect(() => {
    refetch();
  }, [query, refetch]);

  useEffect(() => {
    if (signal) refetch();
    return () => setSignal(false);
  }, [signal, setSignal, refetch]);

  const handleRenameClick = (id: number) => {
    setEditFolderId(id);
    setEditFolderDialogVisible(true);
  };

  const handleDeleteFolder = (id: number) => {
    deleteFolder(id)
      .then((response) => {
        if (response.status === 200) {
          toastRef.current?.show({
            severity: "info",
            summary: "Success",
            detail: "Folder deleted successfully.",
          });
          refetch();
        }
      })
      .catch((error) => console.error(error));
  };

  if (isLoading) return <FolderGridSkeleton />;

  return (
    <div className="pt-14 border-b">
      <CustomToast ref={toastRef} />
      <AddFolderDialog
        refetch={refetch}
        visible={addFolderDialogVisible}
        setVisible={setAddFolderDialogVisible}
      />
      <FolderContentDialog
        visible={folderDialogVisible}
        setVisible={setFolderDialogVisible}
        folderId={folderId}
        setFolderId={setFolderId}
      />
      <EditFolderDialog
        visible={editFolderDialogVisible}
        setVisible={setEditFolderDialogVisible}
        folderId={editFolderId}
        setFolderId={setEditFolderId}
        refetch={refetch}
      />
      <div className="mx-auto w-[600px]">
        <h2 className="text-4xl font-extrabold">
          Need to find a{" "}
          <span className="font-black text-blue-600">folder</span>,{" "}
          <span className="font-black text-blue-600">memo</span>, or a{" "}
          <span className="font-black text-blue-600">guideline</span> in the{" "}
          <span className="font-black text-blue-600">Employee Portal</span>?{" "}
          <span className="font-black text-blue-600">Search</span> it by{" "}
          <span className="font-black text-blue-600">typing something</span> in
          the
          <span className="font-black text-blue-600"> box </span>below.
        </h2>
        <SearchV2 />
        {/* {checkDept() && (
          <Button
            severity="info"
            className="h-10 w-32 bg-white rounded-lg dark:bg-neutral-800 justify-center hover:shadow hover:bg-neutral-100 dark:hover:bg-neutral-700"
            icon={`${PrimeIcons.PLUS} me-2`}
            onClick={() => setAddFolderDialogVisible(true)}
          >
            Add folder
          </Button>
        )} */}
      </div>

      <div className="text-sm flex items-center gap-2 justify-center mb-6">
        <i className={`${PrimeIcons.POWER_OFF}`}></i>
        <p>
          Folders <span className="text-blue-600 font-semibold">managed</span>{" "}
          by <span className="text-blue-600 font-semibold">HR</span> and{" "}
          <span className="text-blue-600 font-semibold">QM</span>
        </p>
      </div>

      <h2></h2>

      <div className="min-h-96 grid grid-cols-3 gap-3 items-start content-start">
        {data?.folders && data?.folders.length > 0 ? (
          data.folders.map((folder) => {
            const folderOverlayRef = React.createRef<OverlayPanel>();

            return (
              <div
                className={`h-32 hover:cursor-pointer p-3 rounded-xl flex flex-col shadow-lg gap-2 justify-between bg-gray-50`}
                key={folder.id}
                onClick={() => {
                  setFolderId(folder.id);
                  setFolderDialogVisible(true);
                }}
              >
                <div className="flex justify-between">
                  {" "}
                  <Image
                    src={folderImg.src}
                    alt="folder"
                    className="h-700 w-7"
                  />
                  {checkDept() && (
                    <Button
                      icon={PrimeIcons.ELLIPSIS_H}
                      onClick={(e) => {
                        e.stopPropagation();
                        folderOverlayRef.current?.toggle(e);
                      }}
                      className={`h-5 w-5 rounded-full grid place-content-center hover:bg-neutral-400 dark:hover:bg-neutral-700 p-4`}
                    >
                      <OverlayPanel
                        ref={folderOverlayRef}
                        className="bg-white dark:bg-neutral-900 text-black dark:text-white"
                      >
                        <div className="flex flex-col gap-1">
                          <Button
                            icon={`${PrimeIcons.USER_EDIT} text-lg`}
                            className="gap-2"
                            onClick={() => handleRenameClick(folder.id)}
                          >
                            Edit
                          </Button>
                          <Button
                            onClick={() => {
                              confirmDialog({
                                message:
                                  "Are you sure you want to delete the folder?",
                                header: "Delete folder",
                                icon: "pi pi-exclamation-triangle",
                                defaultFocus: "accept",
                                accept: () => handleDeleteFolder(folder.id),
                              });
                            }}
                            icon={`${PrimeIcons.TRASH} text-lg`}
                            className="gap-2"
                          >
                            Delete
                          </Button>
                        </div>
                      </OverlayPanel>
                    </Button>
                  )}
                </div>
                <p className="text-sm font-semibold">{folder.name}</p>
              </div>
            );
          })
        ) : (
          <p>No folders found</p>
        )}
      </div>
    </div>
  );
};

export default FolderGrid;
