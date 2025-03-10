import { useQuery } from "@tanstack/react-query";
import { Dialog } from "primereact/dialog";
import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { checkDept, getFolderById } from "../functions/functions";
import {
  deleteFolder,
  getFolderPostsByFolderId,
  getFolderSubfolders,
} from "../utils/service/folderService";
import { Folder, Post, Query } from "../types/types";
import { PrimeIcons } from "primereact/api";
import { InputText } from "primereact/inputtext";
import useSignalStore from "../store/signalStore";
import { Button } from "primereact/button";
import AddSubfolderDialog from "./AddSubfolderDialog";
import { OverlayPanel } from "primereact/overlaypanel";
import { confirmDialog } from "primereact/confirmdialog";
import { Toast } from "primereact/toast";
import CustomToast from "./CustomToast";
import EditFolderDialog from "./EditFolderDialog";
import useDarkModeStore from "../store/darkModeStore";
import FolderPost from "./FolderPost";

interface Props {
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
  folderId: number | undefined;
  setFolderId: Dispatch<SetStateAction<number | undefined>>;
}

const FolderContentDialog: React.FC<Props> = ({
  visible,
  setVisible,
  folderId,
}) => {
  const toastRef = useRef<Toast>(null);
  const [editSubfolderVisible, setEditSubfolderVisible] =
    useState<boolean>(false);
  const [query, setQuery] = useState<Query>({
    search: "",
    skip: 0,
    take: 1000,
  });
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [addSubfolder, setAddSubfolder] = useState<boolean>(false);
  const [folderToEdit, setFolderToEdit] = useState<number | undefined>();
  const { isDarkMode } = useDarkModeStore();
  const [selectedSubfolder, setSelectedSubfolder] = useState<
    number | undefined
  >(undefined);
  const [subfolderDialogVisible, setSubfolderDialogVisible] =
    useState<boolean>(false);
  const { signal } = useSignalStore();

  // Create refs object to store multiple overlay panels
  const overlayPanelsRef = useRef<{ [key: number]: OverlayPanel | null }>({});

  // Callback to set the ref for a specific folder ID
  const setOverlayPanelRef = (id: number) => (el: OverlayPanel | null) => {
    overlayPanelsRef.current[id] = el;
  };

  const { data: folderData } = useQuery({
    queryKey: [`folder-${folderId}`],
    queryFn: () => {
      if (!folderId) return null;
      return getFolderById(folderId);
    },
    enabled: !!folderId,
  });

  const { data, refetch: refetchSubfolders } = useQuery({
    queryKey: [`folder-${folderId}-subfolder`],
    queryFn: async () => {
      if (!folderId) return { data: { subfolders: [], count: 0 } };
      const response = await getFolderSubfolders(folderId, query);
      return response;
    },
    enabled: !!folderId,
  });

  const removeFolder = (id: number) => {
    deleteFolder(id)
      .then((response) => {
        if (response.status === 200) {
          toastRef.current?.show({
            severity: "info",
            summary: "Success",
            detail: "Folder deleted successfully.",
          });
          refetch();
          refetchSubfolders();
        }
      })
      .catch((error) => console.error(error));
  };

  const { data: folderPosts, refetch } = useQuery({
    queryKey: [`folder-${folderId}-posts`],
    queryFn: async () => {
      if (!folderId) return { data: { post: [] } };
      return getFolderPostsByFolderId(folderId, query);
    },
    enabled: !!folderId && folderId !== undefined,
  });

  useEffect(() => {
    refetch();
    refetchSubfolders();
  }, [query, refetch, refetchSubfolders]);

  useEffect(() => {
    if (folderId) {
      refetch();
    }
  }, [refetch, query.search, folderId]);

  useEffect(() => {
    refetch();
    refetchSubfolders();
  }, [refetch, signal, refetchSubfolders]);

  useEffect(() => {
    const interval = setTimeout(() => {
      setQuery((prev) => ({
        search: searchTerm,
        take: prev.take,
        skip: prev.skip,
      }));
    }, 700);

    return () => clearTimeout(interval);
  }, [searchTerm]);

  const handleSubfolderClick = (subfolderId: number) => {
    setSelectedSubfolder(subfolderId);
    setSubfolderDialogVisible(true);
  };

  const handleEditClick = (folderId: number) => {
    setFolderToEdit(folderId);
    setEditSubfolderVisible(true);
  };

  const handleDeleteClick = (folderId: number) => {
    confirmDialog({
      header: "Delete this folder?",
      accept: () => removeFolder(folderId),
    });
  };

  if (!folderId) return null;

  return (
    <>
      <CustomToast ref={toastRef} />
      <Dialog
        visible={visible}
        onHide={() => {
          if (visible) setVisible(false);
        }}
        pt={{
          header: {
            className: ` ${
              !folderData?.folderColor ? "dark:bg-neutral-900" : ""
            } dark:text-white`,
            style: {
              color: folderData?.textColor,
              backgroundColor: folderData?.folderColor,
            },
          },
          content: { className: "dark:bg-neutral-900 dark:text-white pt-2" },
        }}
        className="w-[95%] h-[95vh]"
        header={
          <div className="flex gap-3 items-center">
            <i className={`${PrimeIcons.FOLDER_OPEN} text-2xl`}></i>
            <p>{folderData?.name || "Folder"}</p>
          </div>
        }
      >
        <AddSubfolderDialog
          refetchFolders={refetchSubfolders}
          parentId={folderId}
          visible={addSubfolder}
          setVisible={setAddSubfolder}
          refetch={refetch}
        />
        <EditFolderDialog
          folderId={folderToEdit}
          setFolderId={setFolderToEdit}
          refetch={refetchSubfolders}
          visible={editSubfolderVisible}
          setVisible={setEditSubfolderVisible}
        />
        <div className="my-4 flex gap-3">
          <InputText
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search folder contents..."
            className="w-full bg-neutral-200 dark:bg-neutral-800 py-2 px-4"
          />
          <Button
            icon={`${PrimeIcons.PLUS} text-lg`}
            className="bg-neutral-200 dark:bg-neutral-800"
            onClick={() => setAddSubfolder(true)}
          ></Button>
        </div>
        <div>
          {folderPosts ? (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {data?.data?.subfolders?.map((subfolder: Folder) => (
                <div
                  key={subfolder.id}
                  onClick={() => handleSubfolderClick(subfolder.id)}
                  className={`hover:cursor-pointer h-52 px-3 rounded-lg flex flex-col p-4 gap-2 justify-between ${
                    !subfolder.folderColor
                      ? "bg-neutral-200 hover:shadow dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700"
                      : ""
                  }`}
                  style={{
                    color: subfolder.textColor,
                    backgroundColor: subfolder.folderColor
                      ? subfolder.folderColor
                      : isDarkMode
                      ? "black"
                      : "white",
                  }}
                >
                  <div className="flex items-start gap-2 w-full justify-between">
                    <div className="flex gap-2 w-48">
                      <i className={`${PrimeIcons.FOLDER} text-xl`}></i>
                      <p className="font-medium">{subfolder.name}</p>
                    </div>
                    {checkDept() && (
                      <Button
                        icon={`${PrimeIcons.COG} text-xl`}
                        onClick={(e) => {
                          e.stopPropagation();
                          overlayPanelsRef.current[subfolder.id]?.toggle(e);
                        }}
                      >
                        <OverlayPanel
                          ref={setOverlayPanelRef(subfolder.id)}
                          className="dark:bg-neutral-950 dark:text-white"
                        >
                          <div className="flex flex-col gap-2">
                            <Button
                              icon={`${PrimeIcons.USER_EDIT}`}
                              className="gap-2"
                              onClick={() => handleEditClick(subfolder.id)}
                            >
                              Edit
                            </Button>
                            <Button
                              icon={`${PrimeIcons.TRASH}`}
                              className="gap-2"
                              onClick={() => handleDeleteClick(subfolder.id)}
                            >
                              Delete
                            </Button>
                          </div>
                        </OverlayPanel>
                      </Button>
                    )}
                  </div>
                  <div></div>
                  <div className="flex justify-end">
                    <i className={`${PrimeIcons.ANGLE_RIGHT} text-lg`}></i>
                  </div>
                </div>
              ))}

              {folderPosts.data.post && folderPosts.data.post.length > 0 ? (
                folderPosts.data.post.map((post: Post) => {
                  return <FolderPost post={post} key={post.pid} />;
                })
              ) : (
                <p
                  className={
                    data?.data?.subfolders?.length ? "col-span-full" : ""
                  }
                >
                  No posts found in this folder.
                </p>
              )}
            </div>
          ) : (
            <p>Loading folder contents...</p>
          )}
        </div>
      </Dialog>

      {selectedSubfolder && (
        <FolderContentDialog
          visible={subfolderDialogVisible}
          setVisible={setSubfolderDialogVisible}
          folderId={selectedSubfolder}
          setFolderId={setSelectedSubfolder}
        />
      )}
    </>
  );
};

export default FolderContentDialog;
