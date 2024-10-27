"use client";
import { Icon } from "@iconify/react/dist/iconify.js";
import { motion, Variants } from "framer-motion";
import React, { useEffect, useState } from "react";
import useShowPostStore from "../store/showPostStore";
import useShowUserModalStore from "../store/showUserModal";
import UserButton from "./UserButton";
import { usePathname, useRouter } from "next/navigation";
import PostList from "../posts/components/PostList";
import useTokenStore from "../store/tokenStore";
import { API_BASE, INTRANET } from "../bindings/binding";
import { checkDept, decodeUserData } from "../functions/functions";
import usePostIdStore from "../store/postId";
import apiClient from "../http-common/apiUrl";
import useReadStore from "../store/readStore";

interface Props {
  variants?: Variants;
  isCollapsed?: boolean;
  setIsCollapsed?: (collapsed: boolean) => void;
  isMobile: boolean;
}

const Aside: React.FC<Props> = ({
  isCollapsed,
  setIsCollapsed,
  variants,
  isMobile,
}) => {
  const { setVisible } = useShowPostStore();
  const router = useRouter();
  const pathname = usePathname();
  const { uVisible, setUVisible } = useShowUserModalStore();
  const { setToken } = useTokenStore();
  const [editVisible, setEditVisible] = useState<boolean>(true);
  const [selectedVis, setSelectedVis] = useState<string>("dept");
  const { postId } = usePostIdStore();
  const { isRead, setIsRead } = useReadStore();

  const fetchReadStatus = async () => {
    try {
      const response = await apiClient.get(
        `${API_BASE}/monitoring/read-status?userId=${
          decodeUserData()?.sub
        }&postId=${postId}`
      );

      setIsRead(response.data.message === "Read");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setToken(localStorage.getItem(INTRANET) || "");
  }, [setToken]);

  useEffect(() => {
    if (!checkDept()) {
      setEditVisible(false);
    }
  }, []);

  const handleIntranetClicked = () => {
    fetchReadStatus();
    if (pathname.includes("/posts/") && !isRead) {
      if (confirm("You have not read the post yet, Leave?")) {
        router.push("/");
      } else {
        return;
      }
    } else router.push("/");
  };

  const handleBulletinClicked = async () => {
    fetchReadStatus();
    if (pathname.includes("/posts/") && !isRead) {
      if (confirm("You have not read the post yet, Leave?")) {
        router.push("/bulletin");
      } else {
        return;
      }
    } else router.push("/bulletin");
  };

  const handleDepartmentBulletinClicked = async () => {
    fetchReadStatus();
    if (pathname.includes("/posts/") && !isRead) {
      if (confirm("You have not read the post yet, Leave?")) {
        router.push("/departments-memo");
      } else {
        return;
      }
    } else router.push("/departments-memo");
  };

  const handleForYouClicked = async () => {
    fetchReadStatus();
    if (pathname.includes("/posts/") && !isRead) {
      if (confirm("You have not read the post yet, Leave?")) {
        router.push("/for-you");
      } else {
        return;
      }
    } else router.push("/for-you");
  };

  return (
    <>
      {/* THIS IS FOR DESKTOP VIEW */}
      <motion.aside
        initial="collapsed"
        animate="open"
        exit="collapsed"
        variants={variants}
        className="hidden md:flex flex-col w-full bg-white dark:bg-neutral-900 shadow h-full p-1 rounded-e-3xl"
      >
        <div
          id="buttons"
          className="flex justify-between w-full px-3 pt-2 mb-2"
        >
          <div
            onClick={
              setIsCollapsed ? () => setIsCollapsed(!isCollapsed) : undefined
            }
            className="hover:bg-neutral-200 dark:hover:bg-neutral-800 p-2 cursor-pointer rounded"
          >
            <Icon icon="iconoir:sidebar-collapse" className="h-5 w-5" />
          </div>

          {editVisible && (
            <div
              onClick={() => setVisible(true)}
              className="hover:bg-neutral-200 dark:hover:bg-neutral-800 p-2 cursor-pointer rounded"
            >
              <Icon icon="lucide:edit" className="h-5 w-5" />
            </div>
          )}
        </div>

        {/* THIS CONTAINS YOUR POSTS/MEMOS */}
        <div className="overflow-auto flex-grow mb-3">
          <div id="menu-buttons" className="px-3 mt-2 mb-6">
            <div
              className="flex items-center gap-3 hover:bg-neutral-200 dark:hover:bg-neutral-800 p-2 cursor-pointer rounded"
              onClick={handleIntranetClicked}
            >
              <Icon icon={"ph:hospital"} className="h-5 w-5" />
              <p className="w-full text-md">Intranet</p>
            </div>

            <div
              className="flex items-center gap-3 hover:bg-neutral-200 dark:hover:bg-neutral-800 p-2 cursor-pointer rounded"
              onClick={handleBulletinClicked}
            >
              <Icon icon={"mdi:bulletin-board"} className="h-5 w-5" />
              <p className="w-full text-md">General Bulletin</p>
            </div>

            <div
              className="flex items-center gap-3 hover:bg-neutral-200 dark:hover:bg-neutral-800 p-2 cursor-pointer rounded"
              onClick={handleDepartmentBulletinClicked}
            >
              <Icon
                icon={"arcticons:emoji-department-store"}
                className="h-5 w-5"
              />
              <p className="w-full text-md">Department Bulletin</p>
            </div>

            <div
              className="flex items-center gap-3 hover:bg-neutral-200 dark:hover:bg-neutral-800 p-2 cursor-pointer rounded"
              onClick={handleForYouClicked}
            >
              <Icon icon={"mdi:bulletin-board"} className="h-5 w-5" />
              <p className="w-full text-md">For You</p>
            </div>
          </div>
          <div className="flex flex-col">
            <div
              onClick={(e) => e.stopPropagation()}
              className="w-full flex text-center text-sm rounded mb-6 border dark:border-neutral-900"
            >
              <div
                className={`w-full py-2 grid place-content-center cursor-pointer ${
                  selectedVis === "all" &&
                  "bg-gray-200 dark:bg-neutral-700 rounded-s"
                }`}
                onClick={() => setSelectedVis("all")}
              >
                All
              </div>
              <div
                className={`w-full py-2 grid place-content-center cursor-pointer ${
                  selectedVis === "dept" &&
                  "bg-gray-200 dark:bg-neutral-700 rounded-e"
                }`}
                onClick={() => setSelectedVis("dept")}
              >
                Dept
              </div>
            </div>
            <PostList selectedVis={selectedVis} isMobile={isMobile} />
          </div>
        </div>
        <UserButton uVisible={uVisible} setUVisible={setUVisible} />
      </motion.aside>

      {/* THIS IS FOR MOBILE VIEW */}
      <motion.aside
        initial="collapsed"
        animate="open"
        exit="collapsed"
        variants={variants}
        className="flex md:hidden absolute z-50 flex-col w-full bg-white dark:bg-neutral-900 shadow h-full p-1 rounded-e-3xl"
      >
        <div
          id="buttons"
          className="flex justify-between w-full px-3 pt-2 mb-2"
        >
          <div
            onClick={
              setIsCollapsed ? () => setIsCollapsed(!isCollapsed) : undefined
            }
            className="hover:bg-neutral-200 dark:hover:bg-neutral-800 p-2 cursor-pointer rounded"
          >
            <Icon icon="iconoir:sidebar-collapse" className="h-5 w-5" />
          </div>

          {editVisible && (
            <div
              onClick={() => setVisible(true)}
              className="hover:bg-neutral-200 dark:hover:bg-neutral-800 p-2 cursor-pointer rounded"
            >
              <Icon icon="lucide:edit" className="h-5 w-5" />
            </div>
          )}
        </div>

        {/* THIS CONTAINS YOUR POSTS/MEMOS */}
        <div className="overflow-auto flex-grow mb-3">
          <div id="menu-buttons" className="px-3 mt-2 mb-6">
            <div
              className="flex items-center gap-3 hover:bg-neutral-200 dark:hover:bg-neutral-800 p-2 cursor-pointer rounded"
              onClick={handleIntranetClicked}
            >
              <Icon icon={"ph:hospital"} className="h-5 w-5" />
              <p className="w-full text-md">Intranet</p>
            </div>

            <div
              className="flex items-center gap-3 hover:bg-neutral-200 dark:hover:bg-neutral-800 p-2 cursor-pointer rounded"
              onClick={handleBulletinClicked}
            >
              <Icon icon={"mdi:bulletin-board"} className="h-5 w-5" />
              <p className="w-full text-md">General Bulletin</p>
            </div>

            <div
              className="flex items-center gap-3 hover:bg-neutral-200 dark:hover:bg-neutral-800 p-2 cursor-pointer rounded"
              onClick={handleDepartmentBulletinClicked}
            >
              <Icon
                icon={"arcticons:emoji-department-store"}
                className="h-5 w-5"
              />
              <p className="w-full text-md">Department Bulletin</p>
            </div>

            <div
              className="flex items-center gap-3 hover:bg-neutral-200 dark:hover:bg-neutral-800 p-2 cursor-pointer rounded"
              onClick={handleForYouClicked}
            >
              <Icon icon={"mdi:bulletin-board"} className="h-5 w-5" />
              <p className="w-full text-md">For You</p>
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex flex-col">
              <div
                onClick={(e) => e.stopPropagation()}
                className="w-full flex text-center text-sm rounded mb-6 border dark:border-neutral-900"
              >
                <div
                  className={`w-full py-2 grid place-content-center cursor-pointer ${
                    selectedVis === "all" &&
                    "bg-gray-200 dark:bg-neutral-700 rounded-s"
                  }`}
                  onClick={() => setSelectedVis("all")}
                >
                  All
                </div>
                <div
                  className={`w-full py-2 grid place-content-center cursor-pointer ${
                    selectedVis === "dept" &&
                    "bg-gray-200 dark:bg-neutral-700 rounded-e"
                  }`}
                  onClick={() => setSelectedVis("dept")}
                >
                  Dept
                </div>
              </div>
              <PostList selectedVis={selectedVis} isMobile={isMobile} />
            </div>
          </div>
        </div>
        <UserButton uVisible={uVisible} setUVisible={setUVisible} />
      </motion.aside>
    </>
  );
};

export default Aside;
