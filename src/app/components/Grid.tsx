"use client";
import React, { useEffect, useState } from "react";

import FolderGrid from "./FolderGrid";
import { useQuery } from "@tanstack/react-query";
import { decodeUserData } from "../functions/functions";
import { getLastLogin } from "../utils/service/userService";
import { Dialog } from "primereact/dialog";

const Grid = () => {
  const [userId, setUserId] = useState<number | null>(null);
  const [date, setDate] = useState<string>("");
  const [visible, setVisible] = useState<boolean>(false);

  useEffect(() => {
    if (date !== undefined && date !== "") setVisible(true);
  }, [date]);

  useEffect(() => {
    const userId = decodeUserData()?.sub;

    if (userId) setUserId(userId);
  }, []);

  const { data } = useQuery({
    queryKey: [`deptid-${userId}`],
    queryFn: () => getLastLogin(userId),
    enabled: !!userId || userId !== null,
  });

  useEffect(() => {
    const formattedDate = new Date(
      data?.data.lastLogin.updatedAt
    ).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    setDate(formattedDate);
  }, [data]);

  return (
    <div className="grid gap-20 pb-20">
      <Dialog
        visible={visible}
        className="w-72 "
        maskClassName="backdrop-blur"
        pt={{
          header: { className: "bg-[#EEEEEE] text-blue-600 text-sm" },
          content: { className: "bg-[#EEEEEE] font-medium text-sm" },
        }}
        header={<p className="text-lg font-semibold">Last login info</p>}
        onHide={() => {
          if (visible) setVisible(false);
        }}
      >
        <p>Your last login was on {date}</p>
      </Dialog>
      <FolderGrid />
    </div>
  );
};

export default Grid;
