"use client";
import { Icon } from "@iconify/react/dist/iconify.js";
import { motion, Variants } from "framer-motion";
import React, { useEffect, useState } from "react";
import HoverBox from "./HoverBox";
import useShowPostStore from "../store/showPostStore";
import useShowUserModalStore from "../store/showUserModal";
import UserButton from "./UserButton";
import { useRouter } from "next/navigation";
import PostList from "../posts/components/PostList";
import useTokenStore from "../store/tokenStore";
import { INTRANET } from "../bindings/binding";
import { checkDept } from "../functions/functions";

interface Props {
  variants?: Variants;
  isCollapsed?: boolean;
  setIsCollapsed?: (collapsed: boolean) => void;
}

const Aside: React.FC<Props> = ({ isCollapsed, setIsCollapsed, variants }) => {
  const { setVisible } = useShowPostStore();
  const router = useRouter();
  const { uVisible, setUVisible } = useShowUserModalStore();
  const { setToken } = useTokenStore();
  const [editVisible, setEditVisible] = useState<boolean>(true);
  const [selectedVis, setSelectedVis] = useState<string>("dept");

  useEffect(() => {
    setToken(localStorage.getItem(INTRANET) || "");
  }, [setToken]);

  useEffect(() => {
    if (!checkDept()) {
      setEditVisible(false);
    }
  }, []);

  return (
    <>
      {/* THIS IS FOR DESKTOP VIEW */}
      <motion.aside
        initial="collapsed"
        animate="open"
        exit="collapsed"
        variants={variants}
        className="hidden md:flex flex-col w-full bg-white dark:bg-neutral-900 shadow h-full p-1"
      >
        <div
          id="buttons"
          className="flex justify-between w-full px-3 pt-2 mb-2"
        >
          <HoverBox className="hover:bg-neutral-200 dark:hover:bg-neutral-800 p-2 cursor-pointer rounded">
            <Icon
              icon="iconoir:sidebar-collapse"
              className="h-5 w-5"
              onClick={
                setIsCollapsed ? () => setIsCollapsed(!isCollapsed) : undefined
              }
            />
          </HoverBox>

          {editVisible && (
            <HoverBox className="hover:bg-neutral-200 dark:hover:bg-neutral-800 p-2 cursor-pointer rounded">
              <Icon
                onClick={() => setVisible(true)}
                icon="lucide:edit"
                className="h-5 w-5"
              />
            </HoverBox>
          )}
        </div>

        {/* THIS CONTAINS YOUR POSTS/MEMOS */}
        <div className="overflow-auto flex-grow mb-3">
          <div id="menu-buttons" className="px-3 mt-2 mb-6">
            <HoverBox className="hover:bg-neutral-200 dark:hover:bg-neutral-800 p-2 cursor-pointer rounded">
              <div
                className="flex items-center gap-3"
                onClick={() => router.push("/")}
              >
                <Icon icon={"ph:hospital"} className="h-5 w-5" />
                <p className="w-full text-md">Intranet</p>
              </div>
            </HoverBox>

            <HoverBox className="hover:bg-neutral-200 dark:hover:bg-neutral-800 p-2 cursor-pointer rounded">
              <div
                className="flex items-center gap-3"
                onClick={() => router.push("/bulletin")}
              >
                <Icon icon={"mdi:bulletin-board"} className="h-5 w-5" />
                <p className="w-full text-md">General Bulletin</p>
              </div>
            </HoverBox>
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
            <PostList selectedVis={selectedVis} />
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
        className="flex md:hidden absolute z-50 flex-col w-full bg-white dark:bg-neutral-900 shadow h-full p-1"
      >
        <div
          id="buttons"
          className="flex justify-between w-full px-3 pt-2 mb-2"
        >
          <HoverBox className="hover:bg-neutral-200 dark:hover:bg-neutral-800 p-2 cursor-pointer rounded">
            <Icon
              icon="iconoir:sidebar-collapse"
              className="h-5 w-5"
              onClick={
                setIsCollapsed ? () => setIsCollapsed(!isCollapsed) : undefined
              }
            />
          </HoverBox>

          {editVisible && (
            <HoverBox className="hover:bg-neutral-200 dark:hover:bg-neutral-800 p-2 cursor-pointer rounded">
              <Icon
                onClick={() => setVisible(true)}
                icon="lucide:edit"
                className="h-5 w-5"
              />
            </HoverBox>
          )}
        </div>

        {/* THIS CONTAINS YOUR POSTS/MEMOS */}
        <div className="overflow-auto flex-grow mb-3">
          <div id="menu-buttons" className="px-3 mt-2 mb-6">
            <HoverBox className="hover:bg-neutral-200 dark:hover:bg-neutral-800 p-2 cursor-pointer rounded">
              <div className="flex items-center gap-3">
                <Icon icon="ph:hospital-fill" className="h-5 w-5" />
                <p className="w-full text-md">Intranet</p>
              </div>
            </HoverBox>
            <HoverBox className="hover:bg-neutral-200 dark:hover:bg-neutral-800 p-2 cursor-pointer rounded">
              <div className="flex items-center gap-3">
                <Icon
                  icon="fluent:grid-circles-24-regular"
                  className="h-5 w-5"
                />
                <p className="w-full text-md">Explore Intranet</p>
              </div>
            </HoverBox>
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
              <PostList selectedVis={selectedVis} />
            </div>
            <PostList selectedVis={selectedVis} />
          </div>
        </div>
        <UserButton uVisible={uVisible} setUVisible={setUVisible} />
      </motion.aside>
    </>
  );
};

export default Aside;
