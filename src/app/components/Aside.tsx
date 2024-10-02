"use client";
import { Icon } from "@iconify/react/dist/iconify.js";
import { motion, Variants } from "framer-motion";
import Link from "next/link";
import React from "react";
import HoverBox from "./HoverBox";
import useShowPostStore from "../store/showPostStore";
import useShowUserModalStore from "../store/showUserModal";
import UserButton from "./UserButton";
import { useRouter } from "next/navigation";
import PostList from "../posts/components/PostList";

interface Props {
  variants: Variants;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

const Aside: React.FC<Props> = ({ isCollapsed, setIsCollapsed, variants }) => {
  const { setVisible } = useShowPostStore();
  const router = useRouter();
  const { uVisible, setUVisible } = useShowUserModalStore();

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
              onClick={() => setIsCollapsed(!isCollapsed)}
            />
          </HoverBox>

          <HoverBox className="hover:bg-neutral-200 dark:hover:bg-neutral-800 p-2 cursor-pointer rounded">
            <Icon
              onClick={() => setVisible(true)}
              icon="lucide:edit"
              className="h-5 w-5"
            />
          </HoverBox>
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
              <div className="flex items-center gap-3">
                <Icon icon={"ph:hospital"} className="h-5 w-5" />
                <Link href={"https://westlakemed.com.ph/"}>
                  <p className="w-full text-md truncate">
                    Westlake Medical Center
                  </p>
                </Link>
              </div>
            </HoverBox>
          </div>
          <div className="flex flex-col">
            <PostList />
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
              onClick={() => setIsCollapsed(!isCollapsed)}
            />
          </HoverBox>

          <HoverBox className="hover:bg-neutral-200 dark:hover:bg-neutral-800 p-2 cursor-pointer rounded">
            <Icon
              onClick={() => setVisible(true)}
              icon="lucide:edit"
              className="h-5 w-5"
            />
          </HoverBox>
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
            <PostList />
          </div>
        </div>
        <UserButton uVisible={uVisible} setUVisible={setUVisible} />
      </motion.aside>
    </>
  );
};

export default Aside;
