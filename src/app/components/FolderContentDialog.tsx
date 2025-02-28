import { useQuery } from "@tanstack/react-query";
import { Dialog } from "primereact/dialog";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { getFolderById } from "../functions/functions";
import { getFolderPostsByFolderId } from "../utils/service/folderService";
import { Query } from "../types/types";
import { PrimeIcons } from "primereact/api";
import { InputText } from "primereact/inputtext";

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

  const { data } = useQuery({
    queryKey: [`folder-${folderId}`],
    queryFn: () => getFolderById(folderId),
    enabled: !!folderId,
  });

  const { data: folderPosts, refetch } = useQuery({
    queryKey: [`folder-${folderId}-posts`],
    queryFn: () => getFolderPostsByFolderId(folderId, query),
    enabled: !!folderId,
  });

  useEffect(() => {
    refetch();
  }, [refetch, query.search]);

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
          className: ` ${!data?.folderColor ? "" : ""}`,
          style: {
            color: data?.textColor,
            backgroundColor: data?.folderColor,
          },
        },

        content: { className: "dark:bg-neutral-900 dark:text-white pt-2" },
      }}
      className="w-[95%] h-[95vh]"
      header={
        <div className="flex gap-3 items-center">
          <i className={`${PrimeIcons.FOLDER_OPEN} text-2xl`}></i>
          <p>{data?.name}</p>
        </div>
      }
    >
      <InputText
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {JSON.stringify(folderPosts?.data.post)}
    </Dialog>
  );
};

export default FolderContentDialog;
