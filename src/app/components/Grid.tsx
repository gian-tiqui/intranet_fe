"use client";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import Welcome from "./Welcome";
import { INTRANET } from "../bindings/binding";
import EaseString from "../login/components/EaseString";
import FolderGrid from "./FolderGrid";

const Grid = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  if (!Cookies.get(INTRANET))
    return (
      <div className="w-full h-screen grid place-content-center">
        <EaseString size="text-xl" word="Hello" />
      </div>
    );

  return (
    <div className="grid gap-20 pb-20">
      <FolderGrid />
      <Welcome />
    </div>
  );
};

export default Grid;
