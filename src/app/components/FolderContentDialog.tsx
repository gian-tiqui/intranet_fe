import { useQuery } from "@tanstack/react-query";
import { Dialog } from "primereact/dialog";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  checkDept,
  decodeUserData,
  getFolderById,
} from "../functions/functions";
import {
  deleteFolder,
  getFolderPostsByFolderId,
  getFolderSubfolders,
} from "../utils/service/folderService";
import { Folder, Post, Query } from "../types/types";
import { PrimeIcons } from "primereact/api";
import useSignalStore from "../store/signalStore";
import { Button } from "primereact/button";
import AddSubfolderDialog from "./AddSubfolderDialog";
import { OverlayPanel } from "primereact/overlaypanel";
import { confirmDialog } from "primereact/confirmdialog";
import { Toast } from "primereact/toast";
import CustomToast from "./CustomToast";
import EditFolderDialog from "./EditFolderDialog";
import FolderPost from "./FolderPost";
import blueFolder from "../assets/blue-folder.png";
import SubfolderContainer from "./SubfolderContainer";

interface Props {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  folderId: number | undefined;
  setFolderId: (folderId: number) => void;
  bookMarksIds: number[];
}

const FolderContentDialog: React.FC<Props> = ({
  visible,
  setVisible,
  folderId,
  bookMarksIds,
}) => {
  const toastRef = useRef<Toast>(null);
  const [editSubfolderVisible, setEditSubfolderVisible] =
    useState<boolean>(false);
  const [query] = useState<Query>({
    search: "",
    skip: 0,
    take: 1000,
    isPublished: 1,
  });
  const [addSubfolder, setAddSubfolder] = useState<boolean>(false);
  const [folderToEdit, setFolderToEdit] = useState<number | undefined>();
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
      const deptId = decodeUserData()?.sub;

      return getFolderById(folderId, deptId);
    },
    enabled: !!folderId,
  });

  const { data, refetch: refetchSubfolders } = useQuery({
    queryKey: [`folder-${folderId}-subfolder-${JSON.stringify(query)}`],
    queryFn: async () => {
      if (!folderId) return { data: { subfolders: [], count: 0 } };
      const response = await getFolderSubfolders(folderId, query);
      return response;
    },
    enabled: !!folderId,
  });

  // Fix for FolderContentDialog component
  const organizedFolders = useMemo(() => {
    // Add safety checks
    if (!data?.data?.subfolders || !Array.isArray(data.data.subfolders)) {
      return [];
    }

    if (!bookMarksIds || !Array.isArray(bookMarksIds)) {
      return data.data.subfolders.map((subfolder) => ({
        ...subfolder,
        pinned: false,
      }));
    }

    const markedFolders = data.data.subfolders
      .filter((subfolder) => subfolder && bookMarksIds.includes(subfolder.id))
      .map((subfolder) => ({ ...subfolder, pinned: true }));

    const unMarkedFolders = data.data.subfolders
      .filter((subfolder) => subfolder && !bookMarksIds.includes(subfolder.id))
      .map((subfolder) => ({ ...subfolder, pinned: false }));

    return [...markedFolders, ...unMarkedFolders];
  }, [bookMarksIds, data]);

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
            className: `bg-[#CBD5E1] rounded-t-3xl`,
          },
          content: { className: "bg-[#CBD5E1] pt-2 rounded-b-3xl" },
          root: { className: "rounded-3xl" },
          mask: { className: "backdrop-blur" },
        }}
        className="w-[65%] h-[75vh]"
        header={<p className="ms-6">{folderData?.name || "Folder"}</p>}
      >
        {checkDept() && (
          <Button
            icon={`${PrimeIcons.PLUS}`}
            onClick={() => setAddSubfolder(true)}
            className="absolute right-16 bottom-10 bg-white rounded-full h-10 w-10 shadow-xl border z-10"
          />
        )}
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

        <div>
          {folderPosts ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6">
              {organizedFolders.map(
                (subfolder: Folder & { pinned: boolean }) => (
                  <SubfolderContainer
                    key={subfolder.id}
                    subfolder={subfolder}
                    setVisible={setVisible}
                    handleSubfolderClick={handleSubfolderClick}
                    checkDept={checkDept}
                    overlayPanelsRef={overlayPanelsRef}
                    setOverlayPanelRef={setOverlayPanelRef}
                    handleEditClick={handleEditClick}
                    handleDeleteClick={handleDeleteClick}
                    blueFolder={blueFolder}
                  />
                )
              )}

              {folderPosts.data.post && folderPosts.data.post.length > 0
                ? folderPosts.data.post.map((post: Post) => {
                    return (
                      <FolderPost
                        post={post}
                        key={post.pid}
                        setVisible={setVisible}
                      />
                    );
                  })
                : null}
            </div>
          ) : (
            <p>Loading folder contents...</p>
          )}
        </div>
      </Dialog>

      {selectedSubfolder && (
        <FolderContentDialog
          bookMarksIds={bookMarksIds}
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
