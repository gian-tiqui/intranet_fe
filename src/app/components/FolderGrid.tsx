import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useRef, useState } from "react";
import { checkDept, fetchMainFolders } from "../functions/functions";
import { Query } from "../types/types";
import useSignalStore from "../store/signalStore";
import { Button } from "primereact/button";
import { PrimeIcons } from "primereact/api";
import { InputText } from "primereact/inputtext";
import FolderContentDialog from "./FolderContentDialog";
import AddFolderDialog from "./AddFolderDialog";
import { OverlayPanel } from "primereact/overlaypanel";
import FolderGridSkeleton from "./FolderGridSkeleton";
import EditFolderDialog from "./EditFolderDialog";
import { confirmDialog } from "primereact/confirmdialog";
import { deleteFolder } from "../utils/service/folderService";
import CustomToast from "./CustomToast";
import { Toast } from "primereact/toast";

const FolderGrid = () => {
  const [query, setQuery] = useState<Query>({ search: "", skip: 0, take: 50 });
  const [searchTerm, setSearchTerm] = useState<string>("");
  const { signal, setSignal } = useSignalStore();
  const [folderId, setFolderId] = useState<number>(-1);
  const [editFolderId, setEditFolderId] = useState<number>(-1);
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
    <div className="pt-5 border-b">
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
      <div className="flex justify-end gap-2 mb-10">
        <InputText
          className="px-2 dark:bg-neutral-900 rounded-lg h-10"
          placeholder="Search a folder"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {checkDept() && (
          <Button
            severity="info"
            className="h-10 w-32 bg-white rounded-lg dark:bg-neutral-900 justify-center hover:shadow hover:bg-neutral-100 dark:hover:bg-neutral-950"
            icon={`${PrimeIcons.PLUS} me-2`}
            onClick={() => setAddFolderDialogVisible(true)}
          >
            Add folder
          </Button>
        )}
      </div>

      <div className="flex gap-2 items-center mb-5">
        <i className={`${PrimeIcons.FOLDER} text-lg`}></i>
        <p className="text-lg font-medium">Folders</p>
      </div>

      <div className="min-h-96 grid grid-cols-3 gap-2 items-start content-start">
        {data?.folders && data?.folders.length > 0 ? (
          data.folders.map((folder) => {
            const folderOverlayRef = React.createRef<OverlayPanel>();

            return (
              <div
                className="h-12 hover:cursor-pointer bg-white px-3 rounded-lg dark:bg-neutral-900 flex items-center gap-2 justify-between hover:shadow hover:bg-neutral-100 dark:hover:bg-neutral-950"
                key={folder.id}
                onClick={() => {
                  setFolderId(folder.id);
                  setFolderDialogVisible(true);
                }}
              >
                <div className="flex gap-2">
                  <i className={`${PrimeIcons.FOLDER} text-lg`}></i>
                  <p className="text-sm font-medium">{folder.name}</p>
                </div>
                {checkDept() && (
                  <Button
                    icon={PrimeIcons.ELLIPSIS_H}
                    onClick={(e) => {
                      e.stopPropagation();
                      folderOverlayRef.current?.toggle(e);
                    }}
                    className="h-5 w-5 rounded-full grid place-content-center hover:bg-neutral-400 p-4"
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
                          Rename
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
