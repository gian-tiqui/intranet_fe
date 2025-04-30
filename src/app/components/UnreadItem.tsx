import React from "react";
import { UnreadPost } from "../types/types";
import { Avatar } from "primereact/avatar";
import { Divider } from "primereact/divider";
import formatDate from "../utils/functions/formatDate";
import { Button } from "primereact/button";
import { PrimeIcons } from "primereact/api";
import { useRouter } from "next/navigation";
import useActivityBarStore from "../store/activitybar";

interface Props {
  item: UnreadPost;
}

const UnreadItem: React.FC<Props> = ({ item }) => {
  const router = useRouter();
  const { setShowActivityBar } = useActivityBarStore();
  return (
    <div>
      <div className="flex gap-3 px-6 pt-1">
        <div className="w-10">
          <Avatar
            className="h-10 w-10 bg-blue-600 text-white text-sm font-bold"
            shape="circle"
            label="MT"
          />
        </div>
        <div className="flex flex-col gap-1 w-full">
          <div className="flex gap-3">
            <p className="w-full">
              You haven&apos;t read{" "}
              <span className="font-bold">{item.title}</span> yet
            </p>
            <Button
              className="h-8 w-8"
              icon={`${PrimeIcons.ARROW_UP_RIGHT}`}
              onClick={() => {
                router.push(`/posts/${item.pid}`);
                setShowActivityBar(false);
              }}
            />
          </div>

          <small>{formatDate(item.createdAt)}</small>
          <p className="text-sm">{item.message || "No description"}</p>
        </div>
      </div>
      <Divider className="border-b border-black" />
    </div>
  );
};

export default UnreadItem;
