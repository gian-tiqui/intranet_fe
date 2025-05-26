import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { NotificationType } from "../types/types";
import apiClient from "../http-common/apiUrl";
import { API_BASE, INTRANET } from "../bindings/binding";
import { PrimeIcons } from "primereact/api";
import { Button } from "primereact/button";
import { Avatar } from "primereact/avatar";
import { Divider } from "primereact/divider";
import useCommentIdRedirector from "../store/commentRedirectionId";
import formatDate from "../utils/functions/formatDate"; // Assuming this exists
import useActivityBarStore from "../store/activitybar";
import { decodeUserData } from "../functions/functions";

interface Props {
  notification: NotificationType;
}

const Notification: React.FC<Props> = ({ notification }) => {
  const router = useRouter();
  const { setCid } = useCommentIdRedirector();
  const { setShowActivityBar } = useActivityBarStore();
  const [avatarLabel, setAvatarLabel] = useState<string>("");

  useEffect(() => {
    const fn = decodeUserData()?.firstName;
    const ln = decodeUserData()?.lastName;

    if (!ln || !fn) return;

    const label = fn[0].toUpperCase() + ln[0].toUpperCase();

    setAvatarLabel(label);
  }, []);

  const handleClick = async () => {
    try {
      await apiClient.put(`${API_BASE}/notification/read/${notification.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem(INTRANET)}`,
        },
      });

      if (notification.comment?.parentComment?.cid) {
        setCid(notification.comment.parentComment.cid);
        router.push(`/posts/${notification.comment.parentComment.post.pid}`);
      } else if (!notification.comment?.parentId && notification.comment) {
        setCid(notification.comment.cid);
        router.push(`/posts/${notification.comment.post.pid}`);
      } else {
        router.push(`/posts/${notification.postId}`);
      }
      setShowActivityBar(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <div
        className={`flex gap-3 px-6 pt-1 cursor-pointer text-sm`}
        onClick={handleClick}
      >
        <div className="w-10">
          <Avatar
            className="h-10 w-10 bg-green-600 text-white text-sm font-bold"
            shape="circle"
            label={avatarLabel}
          />
        </div>
        <div className="flex flex-col gap-1 w-full">
          <div className="flex gap-3">
            <p className="w-full">
              <span className="font-bold">Notification:</span>{" "}
              {notification.message}
            </p>
            <Button
              className="h-8 w-8"
              icon={PrimeIcons.ARROW_UP_RIGHT}
              onClick={(e) => {
                e.stopPropagation();
                handleClick();
              }}
            />
          </div>
          {notification.createdAt && (
            <small>{formatDate(notification.createdAt)}</small>
          )}
        </div>
      </div>
      <Divider className="border-b border-black" />
    </div>
  );
};

export default Notification;
