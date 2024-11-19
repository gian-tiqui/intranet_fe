"use client";
import React, { ChangeEvent, ReactNode, useEffect, useState } from "react";
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
import Searchbar from "./Searchbar";
import useHideSearchBarStore from "../store/hideSearchBar";
import usePostUriStore from "../store/usePostUri";
import useEditModalStore from "../store/editModal";
import EditPostModal from "../posts/components/EditModal";
import usePostIdStore from "../store/postId";
import { checkDept, decodeUserData } from "../functions/functions";
import NotificationBell from "./NotificationBell";
import { toast } from "react-toastify";
import { API_BASE, INTRANET } from "../bindings/binding";
import apiClient from "../http-common/apiUrl";
import { toastClass } from "../tailwind-classes/tw_classes";
import DeleteCommentPopup from "../posts/components/DeleteCommentPopup";
import showDeleteCommentModalStore from "../store/deleteComment";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Cookies from "js-cookie";
import Unseen from "./Unseen";
import PendingUsers from "./PendingUsers";
import { jwtDecode } from "jwt-decode";
import useShowImageStore from "../store/imageViewStore";
import ImagePreview from "./ImagePreview";

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
  const [searchText, setSearchText] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");
  const { searchBarHidden } = useHideSearchBarStore();
  const { setPostUri } = usePostUriStore();
  const [loadingSearch, setLoadingSearch] = useState<boolean>(false);
  const { showEditModal } = useEditModalStore();
  const { postId } = usePostIdStore();
  const [editVisible, setEditVisible] = useState<boolean>(true);
  const { showDeleteComment } = showDeleteCommentModalStore();
  const queryClient = new QueryClient();
  const [showPendingUsers, setShowPendingUsers] = useState<boolean>(false);
  const { showImage, setShowImage } = useShowImageStore();

  useEffect(() => {
    const checkLevel = () => {
      const at = localStorage.getItem(INTRANET);

      if (at) {
        const decoded: { confirmed: boolean } = jwtDecode(at);

        if (decoded.confirmed) {
          setShowPendingUsers(true);
        }
      }
    };

    checkLevel();
  }, []);

  useEffect(() => {
    const fetchReads = async () => {
      const response = await apiClient.post(
        `${API_BASE}/notification/user-reads`,
        {
          userId: decodeUserData()?.sub,
          deptId: decodeUserData()?.deptId,

          headers: {
            Authorization: `Bearer ${localStorage.getItem(INTRANET)}`,
          },
        }
      );

      if (!response.data.readAll) {
        toast(response.data.message, { type: "error", className: toastClass });
      }
    };

    if (Cookies.get(INTRANET)) fetchReads();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 767);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [setIsMobile]);

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setSearchText(value);
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setDebouncedSearch(searchText);
      setLoadingSearch(true);
    }, 1000);

    return () => clearTimeout(delayDebounceFn);
  }, [searchText]);

  useEffect(() => {
    const refreshData = async () => {
      setPostUri(debouncedSearch);
    };

    refreshData();
  }, [debouncedSearch, setPostUri]);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const sidebar = document.getElementById("sidebar");

      if (sidebar && !sidebar.contains(target) && isMobile) {
        setIsCollapsed(true);
      }
    };

    document.addEventListener("click", handleOutsideClick);

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [isMobile, isCollapsed, setIsCollapsed]);

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

  useEffect(() => {
    if (!checkDept()) {
      setEditVisible(false);
    }
  }, []);

  const variants = {
    open: isMobile
      ? {
          x: 0,
          width: "75%",
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
    <QueryClientProvider client={queryClient}>
      <div className="flex h-screen text-neutral-800 dark:text-neutral-100">
        {visible && <PostModal isMobile={isMobile} />}
        {shown && <Settings />}
        {showSplash && <LoginSplash />}
        {showEditModal && <EditPostModal postId={postId} />}
        {showDeleteComment && <DeleteCommentPopup />}
        {showImage.show && <ImagePreview mSetShowImage={setShowImage} />}

        <div id="sidebar" onClick={(e) => e.stopPropagation()}>
          <AnimatePresence>
            {isCollapsed ||
              (hidden && (
                <Aside
                  isMobile={isMobile}
                  isCollapsed={isCollapsed}
                  setIsCollapsed={setIsCollapsed}
                  variants={variants}
                />
              ))}
          </AnimatePresence>
        </div>

        <main
          className={`max-h-screen overflow-auto relative w-full ${
            hidden && "px-3"
          }`}
        >
          {hidden && (
            <div
              className="sticky z-10 w-full flex justify-between pt-3 pb-3 top-0 bg-neutral-200 dark:bg-neutral-800"
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

                      {editVisible && (
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
                      )}
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
                      <Icon
                        icon="iconoir:sidebar-collapse"
                        className="h-5 w-5"
                      />
                    </HoverBox>

                    {editVisible && (
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
                    )}
                  </>
                </div>
              </div>

              <div className="flex items-center gap-3 px-3">
                {searchBarHidden && (
                  <Searchbar
                    searchText={searchText}
                    handleSearchChange={handleSearchChange}
                    loading={loadingSearch}
                  />
                )}

                {showPendingUsers && <PendingUsers />}
                <Unseen />
                <NotificationBell />
                <ModeToggler />
              </div>
            </div>
          )}

          <div
            className={`mx-auto w-full ${
              hidden && "max-w-[750px]"
            } px-3 md:px-0`}
          >
            {children}
          </div>
        </main>
      </div>
    </QueryClientProvider>
  );
};

export default Divider;
