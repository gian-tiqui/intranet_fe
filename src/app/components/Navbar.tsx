"use client";
import React, { ReactNode } from "react";
import { Icon } from "@iconify/react";
import HoverBox from "./HoverBox";
import Link from "next/link";
import useNavbarVisibilityStore from "../store/navbarVisibilityStore";
import ModeToggler from "./ModeToggler";
import useToggleStore from "../store/navbarCollapsedStore";
import { AnimatePresence, motion } from "framer-motion";

interface Props {
  children?: ReactNode;
}

const Navbar: React.FC<Props> = ({ children }) => {
  const { hidden } = useNavbarVisibilityStore();
  const { isCollapsed, setIsCollapsed } = useToggleStore();
  const variants = {
    open: {
      x: 0,
      width: "250px",
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 30 },
    },
    collapsed: {
      x: "-100%",
      width: 0,
      opacity: 0,
      transition: { type: "spring", stiffness: 300, damping: 30 },
    },
  };

  return (
    <div className="flex h-screen text-neutral-800 dark:text-neutral-100">
      <AnimatePresence>
        {isCollapsed ||
          (hidden && (
            <motion.nav
              initial="collapsed"
              animate="open"
              exit="collapsed"
              variants={variants}
              className="hidden md:flex flex-col w-96 bg-white dark:bg-neutral-800 shadow h-full p-1"
            >
              <div
                id="buttons"
                className="flex justify-between w-full px-3 pt-2 mb-2"
              >
                <HoverBox className="hover:bg-neutral-200 dark:hover:bg-neutral-900 p-2 cursor-pointer rounded">
                  <Icon
                    icon="iconoir:sidebar-collapse"
                    className="h-5 w-5"
                    onClick={() => setIsCollapsed(!isCollapsed)}
                  />
                </HoverBox>

                <HoverBox className="hover:bg-neutral-200 dark:hover:bg-neutral-900 p-2 cursor-pointer rounded">
                  <Icon icon="lucide:edit" className="h-5 w-5" />
                </HoverBox>
              </div>

              {/* THIS CONTAINS YOUR POSTS/MEMOS */}
              <div className="overflow-auto flex-grow mb-3">
                <div id="menu-buttons" className="px-3 mt-2 mb-6">
                  <HoverBox className="hover:bg-neutral-200 dark:hover:bg-neutral-900 p-2 cursor-pointer rounded">
                    <div className="flex items-center gap-3">
                      <Icon icon="ph:hospital-fill" className="h-5 w-5" />
                      <p className="w-full text-md">Intranet</p>
                    </div>
                  </HoverBox>
                  <HoverBox className="hover:bg-neutral-200 dark:hover:bg-neutral-900 p-2 cursor-pointer rounded">
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
                      <p className="text-xs font-semibold ms-2 mb-2">
                        Day {i + 1}
                      </p>
                      <div className="flex flex-col-reverse">
                        {Array(5)
                          .fill(0)
                          .map((_, index) => (
                            <Link href={`/post/${index}`} key={index}>
                              <HoverBox className="hover:bg-neutral-200 dark:hover:bg-neutral-900 py-1 px-2 cursor-pointer rounded">
                                Post {index + 1}
                              </HoverBox>
                            </Link>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="px-3 mb-3">
                <HoverBox className="hover:bg-neutral-200 dark:hover:bg-neutral-900 p-2 cursor-pointer rounded">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-neutral-200 h-8 w-8"></div>
                    <div>
                      <p className="text-sm">Westlake User</p>
                      <p className="text-xs truncate">IT Department</p>
                    </div>
                  </div>
                </HoverBox>
              </div>
            </motion.nav>
          ))}
      </AnimatePresence>

      <div
        className={`max-h-screen overflow-auto relative w-full ${
          hidden && "px-6"
        }`}
      >
        {hidden && (
          <div
            className=" sticky w-full flex justify-between pt-3 pb-3 top-0 bg-neutral-200 dark:bg-neutral-700"
            id="hi"
          >
            <div id="buttons" className="flex w-full px-3 pt-2 mb-2 gap-3">
              <div className="flex gap-1">
                {isCollapsed && (
                  <>
                    <HoverBox className="hover:bg-neutral-200 dark:hover:bg-neutral-900 p-2 cursor-pointer rounded">
                      <Icon
                        icon="iconoir:sidebar-collapse"
                        className="h-5 w-5"
                        onClick={() => setIsCollapsed(!isCollapsed)}
                      />
                    </HoverBox>

                    <HoverBox className="hover:bg-neutral-200 dark:hover:bg-neutral-900 p-2 cursor-pointer rounded">
                      <Icon icon="lucide:edit" className="h-5 w-5" />
                    </HoverBox>
                  </>
                )}
              </div>

              <p className="text-2xl font-extrabold cursor-pointer">
                Memo Title
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="cursor-pointer rounded-full border border-neutral-800 dark:border-neutral-200 h-9 flex hover:bg-neutral-300 dark:hover:bg-neutral-800 items-center justify-center gap-1 px-4">
                <Icon icon="ri:share-2-fill" className="h-5 w-5" />
                <p>Share</p>
              </div>
              <ModeToggler />
            </div>
          </div>
        )}

        <div className="mx-auto w-full md:w-[350px] lg:w-[750px]">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
