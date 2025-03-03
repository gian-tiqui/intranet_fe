import { useQuery } from "@tanstack/react-query";
import { Dialog } from "primereact/dialog";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { getFolderById } from "../functions/functions";
import { getFolderPostsByFolderId } from "../utils/service/folderService";
import { Post, Query } from "../types/types";
import { PrimeIcons } from "primereact/api";
import { InputText } from "primereact/inputtext";
import useSignalStore from "../store/signalStore";
import { useRouter } from "next/navigation";

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
  const [query, setQuery] = useState<Query>({
    search: "",
    skip: 0,
    take: 1000,
  });
  const [searchTerm, setSearchTerm] = useState<string>("");
  const { signal } = useSignalStore();
  const router = useRouter();

  const { data: folderData } = useQuery({
    queryKey: [`folder-${folderId}`],
    queryFn: () => {
      if (!folderId) return null;
      return getFolderById(folderId);
    },
    enabled: !!folderId,
  });

  const { data: folderPosts, refetch } = useQuery({
    queryKey: [`folder-${folderId}-posts`],
    queryFn: async () => {
      if (!folderId) return { data: { post: [] } };
      return getFolderPostsByFolderId(folderId, query);
    },
    enabled: !!folderId,
  });

  useEffect(() => {
    if (folderId) {
      refetch();
    }
  }, [refetch, query.search, folderId]);

  useEffect(() => {
    refetch();
  }, [refetch, signal]);

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

  return (
    <Dialog
      visible={visible}
      onHide={() => {
        if (visible) setVisible(false);
      }}
      pt={{
        header: {
          className: ` ${!folderData?.folderColor ? "" : ""}`,
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
      <div className="mb-4">
        <InputText
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search folder contents..."
          className="w-full bg-neutral-100 py-2 px-4"
        />
      </div>
      <div>
        {folderPosts ? (
          folderPosts.data.post && folderPosts.data.post.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
              {folderPosts.data.post.map((post: Post) => (
                <div
                  onClick={() => {
                    router.push(`/posts/${post.pid}`);
                  }}
                  key={post.pid}
                  className="w-full h-52 bg-neutral-100 rounded-lg hover:shadow p-4"
                >
                  <p className="font-medium">{post.title}</p>
                </div>
              ))}
            </div>
          ) : (
            <p>No posts found in this folder.</p>
          )
        ) : (
          <p>Loading folder contents...</p>
        )}
      </div>
    </Dialog>
  );
};

export default FolderContentDialog;
