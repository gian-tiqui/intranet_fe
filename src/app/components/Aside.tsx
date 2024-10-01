"use client";
import { Icon } from "@iconify/react/dist/iconify.js";
import { AnimatePresence, motion, Variants } from "framer-motion";
import Link from "next/link";
import React, { useState } from "react";
import HoverBox from "./HoverBox";
import useShowPostStore from "../store/showPostStore";
import useShowUserModalStore from "../store/showUserModal";
import UserButton from "./UserButton";
import { useRouter } from "next/navigation";
import MotionTemplate from "./animation/MotionTemplate";

interface Props {
  variants: Variants;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

const Aside: React.FC<Props> = ({ isCollapsed, setIsCollapsed, variants }) => {
  const { setVisible } = useShowPostStore();
  const arr: number[] = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1];
  const [maxNum, setMaxNum] = useState<number>(2);
  const router = useRouter();
  const { uVisible, setUVisible } = useShowUserModalStore();

  const showMore = () => {
    setMaxNum((prevMax) => prevMax + 3);
  };
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
            <AnimatePresence>
              {arr.slice(0, maxNum).map((item, i) => (
                <MotionTemplate key={i}>
                  <div className="px-3 mb-8">
                    <p className="text-xs font-semibold ms-2 mb-2">
                      Day {item}
                    </p>
                    <div className="flex flex-col-reverse">
                      {Array(5)
                        .fill(0)
                        .map((_, index) => (
                          <Link href={`/post/${index}`} key={index}>
                            <HoverBox className="hover:bg-neutral-200 dark:hover:bg-neutral-800 py-1 px-2 cursor-pointer rounded">
                              <p> Lorem Ipsum {index + 1}</p>
                            </HoverBox>
                          </Link>
                        ))}
                    </div>
                  </div>
                </MotionTemplate>
              ))}
            </AnimatePresence>

            <HoverBox className="hover:bg-neutral-200 dark:hover:bg-neutral-800 py-1 px-2 mx-4 cursor-pointer rounded">
              <button onClick={showMore} className="w-full">
                Show more
              </button>
            </HoverBox>
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
          <div className="flex flex-col-reverse">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="px-3 mb-8">
                <p className="text-xs font-semibold ms-2 mb-2">Day {i + 1}</p>
                <div className="flex flex-col-reverse">
                  {Array(5)
                    .fill(0)
                    .map((_, index) => (
                      <div
                        key={index}
                        onClick={() => {
                          setIsCollapsed(true);
                        }}
                      >
                        <Link href={`/post/${index}`}>
                          <HoverBox className="hover:bg-neutral-200 dark:hover:bg-neutral-800 py-1 px-2 cursor-pointer rounded">
                            Post {index + 1}
                          </HoverBox>
                        </Link>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        <UserButton uVisible={uVisible} setUVisible={setUVisible} />
      </motion.aside>
    </>
  );
};

export default Aside;
