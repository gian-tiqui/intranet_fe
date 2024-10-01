"use client";
import React, { ReactNode, useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import HoverBox from "./HoverBox";
import useNavbarVisibilityStore from "../store/navbarVisibilityStore";
import ModeToggler from "./ModeToggler";
import useToggleStore from "../store/navbarCollapsedStore";
import { AnimatePresence } from "framer-motion";
import Aside from "./Aside";
import PostModal from "../posts/components/PostModal";
import useShowPostStore from "../store/showPostStore";
import Settings from "./Settings";
import useShowSettingsStore from "../store/showSettingStore";
import LoginSplash from "./RefreshSplashArt";
import useSplashToggler from "../store/useSplashStore";

/*
 *
 *
 * Start commenting here
 *
 */

interface Props {
  children?: ReactNode;
}

const Divider: React.FC<Props> = ({ children }) => {
  const { hidden } = useNavbarVisibilityStore();
  const { isCollapsed, setIsCollapsed } = useToggleStore();
  const { visible, setVisible } = useShowPostStore();
  const { shown } = useShowSettingsStore();
  const [isMobile, setIsMobile] = useState(false);
  const { showSplash, setShowSplash } = useSplashToggler();

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowSplash(false);
    }, 3000);

    return () => clearTimeout(timeout);
  }, [setShowSplash, showSplash]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const variants = {
    open: isMobile
      ? {
          x: 0,
          width: "100%",
          opacity: 1,
          transition: { type: "spring", stiffness: 300, damping: 30 },
        }
      : {
          x: 0,
          width: "45vh",
          opacity: 1,
          transition: { type: "spring", stiffness: 300, damping: 30 },
        },
    collapsed: {
      x: isMobile ? "-100%" : "-50%",
      width: 0,
      opacity: 0,
      transition: { type: "spring", stiffness: 300, damping: 30 },
    },
  };

  return (
    <div className="flex h-screen text-neutral-800 dark:text-neutral-100">
      {visible && <PostModal />}
      {shown && <Settings />}
      {showSplash && <LoginSplash />}

      <AnimatePresence>
        {isCollapsed ||
          (hidden && (
            <Aside
              isCollapsed={isCollapsed}
              setIsCollapsed={setIsCollapsed}
              variants={variants}
            />
          ))}
      </AnimatePresence>

      <main
        className={`max-h-screen overflow-auto relative w-full ${
          hidden && "px-3"
        }`}
      >
        {hidden && (
          <div
            className="sticky w-full flex justify-between pt-3 pb-3 top-0 bg-neutral-200 dark:bg-neutral-800"
            id="hi"
          >
            <div id="buttons" className="flex w-full pt-2 mb-2 gap-3">
              {/* THIS IS FOR DESKTOP VIEW */}

              <div className="md:flex gap-1 hidden">
                {isCollapsed && (
                  <>
                    <HoverBox
                      key="desktop-collapser"
                      collapser={true}
                      className="hover:bg-neutral-300 dark:hover:bg-neutral-900 p-2 cursor-pointer rounded"
                    >
                      <Icon
                        icon="iconoir:sidebar-collapse"
                        className="h-5 w-5"
                      />
                    </HoverBox>

                    <HoverBox
                      key="desktop-edit"
                      className="hover:bg-neutral-300 dark:hover:bg-neutral-900 p-2 cursor-pointer rounded"
                    >
                      <Icon
                        onClick={() => setVisible(true)}
                        icon="lucide:edit"
                        className="h-5 w-5"
                      />
                    </HoverBox>
                  </>
                )}
              </div>

              {/* THIS IS FOR MOBILE VIEW */}

              <div className="flex gap-1 md:hidden">
                <>
                  <HoverBox
                    key="mobile-collapser"
                    collapser={true}
                    className="hover:bg-neutral-300 dark:hover:bg-neutral-900 p-2 cursor-pointer rounded"
                  >
                    <Icon icon="iconoir:sidebar-collapse" className="h-5 w-5" />
                  </HoverBox>

                  <HoverBox
                    key="mobile-edit"
                    className="hover:bg-neutral-300 dark:hover:bg-neutral-900 p-2 cursor-pointer rounded"
                  >
                    <Icon
                      onClick={() => setVisible(true)}
                      icon="lucide:edit"
                      className="h-5 w-5"
                    />
                  </HoverBox>
                </>
              </div>
            </div>

            <div className="flex items-center gap-3 px-3">
              <ModeToggler />
            </div>
          </div>
        )}

        <div
          className={`mx-auto w-full ${hidden && "max-w-[750px]"} px-3 md:px-0`}
        >
          {children}
        </div>
      </main>
    </div>
  );
};

export default Divider;
