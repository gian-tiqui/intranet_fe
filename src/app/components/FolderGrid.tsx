"use client";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useRef, useState } from "react";
import {
  checkDept,
  decodeUserData,
  fetchMainFolders,
} from "../functions/functions";
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
import useAddFolderStore from "../store/addFolderDialog";
import folderIdStore from "../store/folderId";
import useFolderDialogVisibleStore from "../store/folderDialog";
import { motion } from "motion/react";
import useEditFolderDialogVisibleStore from "../store/editFolderDialogVisible";
import useEditFolderIdStore from "../store/editFolderId";
import useDepartments from "../custom-hooks/departments";
import { getPostTypes } from "../utils/service/postTypeService";
import { INTRANET } from "../bindings/binding";
import Cookies from "js-cookie";
import { getBookMarksByUserID } from "../utils/service/userService";

const FolderGrid = () => {
  const departments = useDepartments();
  const { data: postTypeResponse } = useQuery({
    queryKey: ["post-types"],
    queryFn: () => getPostTypes(),
    enabled: !!Cookies.get(INTRANET) && Cookies.get(INTRANET) !== undefined,
  });
  const [query, setQuery] = useState<Query>({
    search: "",
    skip: 0,
    take: 50,
    includeSubfolders: 0,
    isPublished: 1,
  });
  const [searchTerm] = useState<string>("");
  const [mounted, setMounted] = useState(false);
  const { signal, setSignal } = useSignalStore();
  const { folderId, setFolderId } = folderIdStore();
  const { editFolderId, setEditFolderId } = useEditFolderIdStore();
  const { editFolderDialogVisible, setEditFolderDialogVisible } =
    useEditFolderDialogVisibleStore();
  const { folderDialogVisible, setFolderDialogVisible } =
    useFolderDialogVisibleStore();
  const { addFolderDialogVisible, setAddFolderDialogVisible } =
    useAddFolderStore();

  const toastRef = useRef<Toast>(null);
  const { data, isLoading, refetch } = useQuery({
    queryKey: [`folders-grid`],
    queryFn: () => {
      const deptId = decodeUserData()?.sub;

      return fetchMainFolders({ ...query });
    },
    enabled:
      !!Cookies.get(INTRANET) &&
      Cookies.get(INTRANET) !== undefined &&
      !!localStorage.getItem(INTRANET) &&
      localStorage.getItem(INTRANET) !== undefined,
  });

  const { data: bookmarksResponse } = useQuery({
    queryKey: [`bookmark`, decodeUserData()?.sub],
    queryFn: () => getBookMarksByUserID(decodeUserData()?.sub),
    enabled: !!decodeUserData()?.sub && decodeUserData()?.sub !== undefined,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

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

  // Always render the same container structure
  return (
    <div className="min-h-screen px-6 pt-10">
      <CustomToast ref={toastRef} />
      <AddFolderDialog
        refetch={refetch}
        visible={addFolderDialogVisible}
        setVisible={setAddFolderDialogVisible}
      />
      <FolderContentDialog
        bookMarksIds={bookmarksResponse?.data.bookMarksIds}
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

      <div className="text-center mb-6">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2">
          WMC Employee Portal
        </h1>
        <p className="text-gray-600 text-lg">
          Search and manage posts, folders, and employees across your
          organization
        </p>
      </div>

      {/* Show skeleton while loading or not mounted */}
      {isLoading || !mounted ? (
        <FolderGridSkeleton />
      ) : (
        <>
          {/* Main Content */}
          <div className="max-w-6xl mx-auto mb-6">
            {/* Folders Grid */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: {
                  transition: {
                    staggerChildren: 0.1,
                  },
                },
              }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {data?.folders && data?.folders.length > 0 ? (
                data.folders.map((folder, index) => {
                  const folderOverlayRef = React.createRef<OverlayPanel>();

                  return (
                    <motion.div
                      key={folder.id}
                      variants={{
                        hidden: { opacity: 0, y: 30, scale: 0.9 },
                        visible: {
                          opacity: 1,
                          y: 0,
                          scale: 1,
                          transition: {
                            type: "spring",
                            stiffness: 100,
                            damping: 12,
                            delay: index * 0.05,
                          },
                        },
                      }}
                      whileHover={{
                        y: -5,
                        scale: 1.02,
                        transition: { duration: 0.2 },
                      }}
                      className="group relative bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden"
                      onClick={() => {
                        setFolderId(folder.id);
                        setFolderDialogVisible(true);
                      }}
                    >
                      {/* Gradient Background Effect */}
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                      {/* Folder Header */}
                      <div className="relative flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow duration-300">
                              <i className="pi pi-folder text-white text-lg" />
                            </div>
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          </div>
                        </div>

                        {/* Actions Menu */}
                        {checkDept() && (
                          <div className="relative z-10">
                            <Button
                              icon={PrimeIcons.ELLIPSIS_V}
                              onClick={(e) => {
                                e.stopPropagation();
                                folderOverlayRef.current?.toggle(e);
                              }}
                              className="w-8 h-8 rounded-full bg-gray-100/50 hover:bg-gray-200/70 border-0 text-gray-600 hover:text-gray-800 transition-all duration-200 opacity-0 group-hover:opacity-100"
                            />
                            <OverlayPanel
                              ref={folderOverlayRef}
                              className="modern-overlay-panel"
                            >
                              <div className="flex flex-col gap-2 p-2">
                                <Button
                                  icon={PrimeIcons.PENCIL}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleRenameClick(folder.id);
                                  }}
                                  className="w-full justify-start gap-3 px-3 py-2 text-sm bg-transparent hover:bg-blue-50 text-gray-700 hover:text-blue-600 border-0 rounded-lg transition-all duration-200"
                                >
                                  Edit Folder
                                </Button>
                                <Button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    confirmDialog({
                                      message:
                                        "Are you sure you want to delete this folder?",
                                      header: "Delete Folder",
                                      icon: "pi pi-exclamation-triangle",
                                      defaultFocus: "accept",
                                      accept: () =>
                                        handleDeleteFolder(folder.id),
                                      acceptClassName: "p-button-danger",
                                    });
                                  }}
                                  icon={PrimeIcons.TRASH}
                                  className="w-full justify-start gap-3 px-3 py-2 text-sm bg-transparent hover:bg-red-50 text-gray-700 hover:text-red-600 border-0 rounded-lg transition-all duration-200"
                                >
                                  Delete Folder
                                </Button>
                              </div>
                            </OverlayPanel>
                          </div>
                        )}
                      </div>

                      {/* Folder Content */}
                      <div className="relative">
                        <h3 className="font-semibold text-gray-800 group-hover:text-gray-900 transition-colors duration-200 mb-2 line-clamp-2">
                          {folder.name}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <i className="pi pi-file-o text-xs" />
                          <span>
                            {(folder.posts && folder.posts.length) || 0}{" "}
                            documents
                          </span>
                        </div>
                      </div>

                      {/* Hover Effect Border */}
                      <div className="absolute inset-0 rounded-2xl border-2 border-blue-400/0 group-hover:border-blue-400/20 transition-colors duration-300" />
                    </motion.div>
                  );
                })
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="col-span-full flex flex-col items-center justify-center py-16"
                >
                  <div className="text-center">
                    <div className="w-24 h-24 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center mb-4 mx-auto">
                      <i className="pi pi-folder text-gray-400 text-3xl" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">
                      No folders found
                    </h3>

                    {checkDept() && (
                      <>
                        <p className="text-gray-500 mb-6">
                          Create your first folder to get started organizing
                          your documents
                        </p>
                        <Button
                          onClick={() => setAddFolderDialogVisible(true)}
                          className="bg-gradient-to-r from-blue-600 gap-2 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 border-0"
                          icon={PrimeIcons.PLUS}
                        >
                          Create First Folder
                        </Button>
                      </>
                    )}
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>
        </>
      )}

      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-6xl mx-auto mb-8"
      >
        {/* Search Section */}
        <div className="max-w-4xl mx-auto">
          <SearchV2
            departments={departments}
            postTypes={postTypeResponse?.data.postTypes}
          />
        </div>
      </motion.div>

      {/* Custom Styles */}
      <style jsx global>{`
        .modern-overlay-panel .p-overlaypanel {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 16px;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
            0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }

        .modern-overlay-panel .p-overlaypanel-content {
          padding: 0;
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out;
        }
      `}</style>
    </div>
  );
};

export default FolderGrid;
