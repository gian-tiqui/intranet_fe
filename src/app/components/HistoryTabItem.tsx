import React from "react";
import { Post } from "../types/types";
import { Avatar } from "primereact/avatar";
import { Divider } from "primereact/divider";
import formatDate from "../utils/functions/formatDate";
import { Button } from "primereact/button";
import { PrimeIcons } from "primereact/api";
import { useRouter } from "next/navigation";
import useActivityBarStore from "../store/activitybar";

interface Props {
  item: { createdAt: string; updatedAt: string; post: Post };
}

const HistoryTabItem: React.FC<Props> = ({ item }) => {
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
              You have read <span className="font-bold">{item.post.title}</span>
            </p>
            <Button
              className="h-8 w-8"
              icon={`${PrimeIcons.ARROW_UP_RIGHT}`}
              onClick={() => {
                router.push(`/posts/${item.post.pid}`);
                setShowActivityBar(false);
              }}
            />
          </div>

          <small>{formatDate(item.createdAt)}</small>
          <p className="text-sm">{item.post.message || "No description"}</p>
        </div>
      </div>
      <Divider className="border-b border-black" />
    </div>
  );
};

export default HistoryTabItem;
