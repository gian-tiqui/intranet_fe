"use client";
import useSubfolderStore from "@/app/store/subfolderStore";
import { useRouter } from "next/navigation";
import React from "react";

interface Props {
  name: string | undefined;
}

const LocationComp: React.FC<Props> = ({ name }) => {
  const router = useRouter();
  const { subfolder } = useSubfolderStore();

  const handleNameClick = () => {
    if (name) router.back();
  };

  return (
    <div className="flex items-center gap-1 text-xs mb-4">
      <p
        onClick={handleNameClick}
        className={`${name && "hover:underline cursor-pointer"}`}
      >
        Portal
      </p>
      {name && (
        <>
          <p>/</p>
          <p className="hover:underline cursor-pointer">{name}</p>
        </>
      )}
      {subfolder && (
        <>
          <p>/</p>
          <p className="hover:underline cursor-pointer">{subfolder.name}</p>
        </>
      )}
    </div>
  );
};

export default LocationComp;