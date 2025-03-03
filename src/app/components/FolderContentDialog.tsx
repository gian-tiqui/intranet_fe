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
import Image from "next/image";
import { API_BASE } from "../bindings/binding";

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
      <div className="my-4">
        <InputText
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search folder contents..."
          className="w-full bg-neutral-200 dark:bg-neutral-800 py-2 px-4"
        />
      </div>
      <div>
        {folderPosts ? (
          folderPosts.data.post && folderPosts.data.post.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {folderPosts.data.post.map((post: Post) => (
                <div
                  onClick={() => {
                    router.push(`/posts/${post.pid}`);
                  }}
                  key={post.pid}
                  className="w-full h-52 bg-neutral-200 flex flex-col justify-between dark:bg-neutral-800 rounded-lg hover:shadow p-4"
                >
                  <p className="font-medium">{post.title}</p>
                  <div className="w-full h-[70%] rounded bg-neutral-50 grid relative place-content-center dark:bg-neutral-900">
                    {post.imageLocations && post.imageLocations.length > 0 ? (
                      <Image
                        src={`${API_BASE}/uploads/${post.imageLocations[0].imageLocation}`}
                        alt={post.imageLocations[0].imageLocation}
                        className="rounded"
                        fill
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-2">
                        <i className={`${PrimeIcons.IMAGE} text-2xl`}></i>
                        <p className="text-sm">No attachments</p>
                      </div>
                    )}
                  </div>
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
