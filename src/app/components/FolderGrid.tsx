import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { fetchMainFolders } from "../functions/functions";
import { Query } from "../types/types";
import useSignalStore from "../store/signalStore";
import { Button } from "primereact/button";
import { PrimeIcons } from "primereact/api";
import { InputText } from "primereact/inputtext";

const FolderGrid = () => {
  const [query, setQuery] = useState<Query>({ search: "", skip: 0, take: 50 });
  const [searchTerm, setSearchTerm] = useState<string>("");
  const { signal, setSignal } = useSignalStore();

  const { data, isLoading, error, isError, refetch } = useQuery({
    queryKey: [`folders-grid`],
    queryFn: () => fetchMainFolders(query),
  });

  useEffect(() => {
    const handler = setTimeout(() => {
      setQuery((prev) => ({ ...prev, search: searchTerm }));
    });

    return () => clearTimeout(handler);
  }, [searchTerm]);

  useEffect(() => {
    refetch();
  }, [query, refetch]);

  useEffect(() => {
    if (signal) refetch();

    return () => setSignal(false);
  }, [signal, setSignal, refetch]);

  if (isLoading) return <p>Loading... Please wait</p>;

  return (
    <div className="pt-5 border-b">
      <div className="flex justify-end gap-2 mb-2">
        <InputText
          className="px-2 dark:bg-neutral-900"
          placeholder="Search a folder"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {
          <Button
            severity="info"
            className="h-10 w-32 bg-white rounded-lg dark:bg-neutral-900 justify-center hover:shadow hover:bg-neutral-100 dark:hover:bg-neutral-950"
            icon={`${PrimeIcons.PLUS} me-2`}
          >
            Add folder
          </Button>
        }
      </div>

      <div className="min-h-96">
        {data?.folders && data?.folders.length > 0 ? (
          data.folders.map((folder) => (
            <Button
              className="h-10 w-32 bg-white rounded-lg dark:bg-neutral-900 justify-center hover:shadow hover:bg-neutral-100 dark:hover:bg-neutral-950"
              key={folder.id}
            >
              {folder.name}
            </Button>
          ))
        ) : (
          <p>No folders found</p>
        )}
      </div>
    </div>
  );
};

export default FolderGrid;
