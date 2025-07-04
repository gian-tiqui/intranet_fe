"use client";
import React, { ReactNode, useEffect, useState } from "react";
import useNavbarVisibilityStore from "../store/navbarVisibilityStore";
import useToggleStore from "../store/navbarCollapsedStore";
import { AnimatePresence } from "framer-motion";
import Aside from "./Aside";
import PostModal from "../posts/components/PostModal";
import useShowPostStore from "../store/showPostStore";
import Settings from "./Settings";
import { motion } from "motion/react";
import useShowSettingsStore from "../store/showSettingStore";
import useSplashToggler from "../store/useSplashStore";
import useEditModalStore from "../store/editModal";
import EditPostModal from "../posts/components/EditModal";
import usePostIdStore from "../store/postId";
import { checkDept, decodeUserData } from "../functions/functions";
import wmcLogo from "../assets/westlake_logo_horizontal.jpg.png";
import { API_BASE, INTRANET } from "../bindings/binding";
import apiClient from "../http-common/apiUrl";
import DeleteCommentPopup from "../posts/components/DeleteCommentPopup";
import showDeleteCommentModalStore from "../store/deleteComment";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import useDeleteModalStore from "../store/deleteModalStore";
import DeleteModal from "../posts/components/DeleteModal";
import useTokenStore from "../store/tokenStore";
import { ConfirmDialog } from "primereact/confirmdialog";
import Image from "next/image";
import ovalGradient from "../assets/oval-gradient.png";
import upperLeftGradient from "../assets/upper-left-gradient.png";
import { Image as PrimeImage } from "primereact/image";
import { usePathname } from "next/navigation";
import HeaderIcons from "./HeaderIcons";
import UserActivitiesBar from "./UserActivitiesBar";
import useActivityBarStore from "../store/activitybar";
import useLoginStore from "../store/loggedInStore";
import SearchContainer from "./SearchContainer";
import { SpeedDial } from "primereact/speeddial";
import useAddFolderStore from "../store/addFolderDialog";
import { PrimeIcons } from "primereact/api";
import useShowSearchStore from "../store/showSearch";
import UserProfileDialog from "./UserProfileDialog";
import useToastRefStore from "../store/toastRef";
import { Toast } from "primereact/toast";
import EditFolderDialog from "./EditFolderDialog";
import useEditFolderDialogVisibleStore from "../store/editFolderDialogVisible";
import useEditFolderIdStore from "../store/editFolderId";
import Tutorial from "./Tutorial";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Button } from "primereact/button";
import IncidentReportDialog from "../incident-report/components/IncidentReportDialog";

interface Props {
  children?: ReactNode;
}

const Divider: React.FC<Props> = ({ children }) => {
  const { showActivityBar, setShowActivityBar } = useActivityBarStore();
  const pathname = usePathname();
  const { hidden } = useNavbarVisibilityStore();
  const { isCollapsed, setIsCollapsed } = useToggleStore();
  const { visible, setVisible } = useShowPostStore();
  const { shown } = useShowSettingsStore();
  const [isMobile, setIsMobile] = useState(false);
  const { showSplash, setShowSplash } = useSplashToggler();
  const { showEditModal } = useEditModalStore();
  const { postId } = usePostIdStore();
  const [editVisible, setEditVisible] = useState<boolean>(true);
  const { showDeleteComment } = showDeleteCommentModalStore();
  const queryClient = new QueryClient();
  const [showPendingUsers, setShowPendingUsers] = useState<boolean>(false);
  const { setShowDeleteModal, showDeleteModal } = useDeleteModalStore();
  const { token } = useTokenStore();
  const { isLoggedIn } = useLoginStore();
  const [hydrated, setHydrated] = useState<boolean>(false);
  const { setAddFolderDialogVisible } = useAddFolderStore();
  const { showSearch } = useShowSearchStore();
  const [unreadVisible, setUnreadVisible] = useState<boolean>(false);
  const [unreadMessage, setUnreadMessage] = useState<string>("");
  const { toastRef } = useToastRefStore();
  const { editFolderDialogVisible, setEditFolderDialogVisible } =
    useEditFolderDialogVisibleStore();
  const { editFolderId, setEditFolderId } = useEditFolderIdStore();
  const [reportDialogVisible, setReportDialogVisible] =
    useState<boolean>(false);
  const items = [
    ...(checkDept()
      ? [
          {
            label: "Post",
            icon: "pi pi-pen-to-square",
            command: () => {
              setVisible(true);
            },
          },
          {
            label: "New Folder",
            icon: PrimeIcons.FOLDER,
            command: () => {
              setAddFolderDialogVisible(true);
            },
          },
        ]
      : []),
    {
      label: "Incident Report",
      icon: PrimeIcons.FLAG,
      command: () => {
        setReportDialogVisible(true);
      },
    },
  ];

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!isLoggedIn) setShowActivityBar(false);
  }, [isLoggedIn, setShowActivityBar]);

  useEffect(() => {
    if (!checkDept()) {
      setEditVisible(false);
    }
  }, []);

  useEffect(() => {
    const checkLevel = () => {
      const at = token;

      if (at) {
        const decoded: { lid: number } = jwtDecode(at);

        if (decoded.lid > 1) {
          setShowPendingUsers(true);
        } else {
          setShowPendingUsers(false);
        }
      }
    };

    checkLevel();
  }, [token]);

  useEffect(() => {
    if (!checkDept()) {
      setEditVisible(false);
    }
  }, [editVisible]);

  useEffect(() => {
    const fetchReads = async () => {
      const response = await apiClient.post(
        `${API_BASE}/notification/user-reads`,
        {
          userId: decodeUserData()?.sub,
          deptId: decodeUserData()?.deptId,
        }
      );

      if (!response.data.readAll) {
        setUnreadVisible(true);
        setUnreadMessage(response.data.message);
      }
    };

    if (INTRANET && Cookies.get(INTRANET)) fetchReads();
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
    }, 6000);

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

  const checkLocation = () => {
    const locations = ["welcome", "login", "forgot-password"];

    return !locations.some((location) => pathname.includes(location));
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ConfirmDialog
        pt={{
          root: {
            className:
              "w-[28rem] max-w-[90vw] rounded-2xl shadow-2xl border-0 overflow-hidden bg-white",
          },
          header: {
            className:
              "bg-gradient-to-r from-gray-50 to-white border-b border-gray-200 px-6 py-5",
          },
          headerTitle: {
            className: "text-xl font-semibold text-gray-800",
          },
          content: {
            className: "bg-white px-6 py-6",
          },
          footer: {
            className:
              "bg-gradient-to-r from-gray-50 to-white border-t border-gray-200 px-6 py-4 flex gap-3 justify-end",
          },
          message: {
            className:
              "text-gray-700 text-base leading-relaxed font-medium ml-4",
          },
          icon: {
            className:
              "w-12 h-12 rounded-full bg-gradient-to-r  from-amber-400 to-orange-500 grid place-content-center ps-3 text-white text-xl shadow-lg flex-shrink-0",
          },
          acceptButton: {
            className: `
        px-6 py-3 min-w-[100px] h-11
        bg-gradient-to-r from-red-500 to-red-600 
        border-none rounded-xl text-white font-semibold text-sm
        hover:from-red-600 hover:to-red-700 
        focus:ring-2 focus:ring-red-500/20 focus:ring-offset-2
        transition-all duration-200 ease-in-out
        hover:shadow-lg hover:-translate-y-0.5
        active:translate-y-0 active:shadow-md
        disabled:opacity-50 disabled:cursor-not-allowed
      `,
          },
          rejectButton: {
            className: `
        px-6 py-3 min-w-[100px] h-11 mr-3
        bg-white border-2 border-gray-300 text-gray-700 font-semibold text-sm
        rounded-xl
        hover:bg-gray-50 hover:border-gray-400
        focus:ring-2 focus:ring-gray-500/20 focus:ring-offset-2
        transition-all duration-200 ease-in-out
        hover:shadow-md hover:-translate-y-0.5
        active:translate-y-0 active:shadow-sm
        disabled:opacity-50 disabled:cursor-not-allowed
      `,
          },
        }}
        maskClassName="backdrop-blur-sm bg-black/30"
      />
      <Tutorial />
      <Toast ref={toastRef} />
      <IncidentReportDialog
        visible={reportDialogVisible}
        setVisible={setReportDialogVisible}
      />
      <EditFolderDialog
        visible={editFolderDialogVisible}
        setVisible={setEditFolderDialogVisible}
        folderId={editFolderId}
        setFolderId={setEditFolderId}
      />
      <UserProfileDialog />
      <div className="flex h-screen text-neutral-800 dark:text-neutral-100">
        {showSearch && <SearchContainer />}
        {visible && <PostModal isMobile={isMobile} />}
        {shown && <Settings />}
        {showEditModal && <EditPostModal postId={postId} />}
        {showDeleteComment && <DeleteCommentPopup />}
        {showDeleteModal && (
          <div className="w-full h-full absolute grid place-content-center bg-black/60 z-50">
            <DeleteModal setShowDeleteModal={setShowDeleteModal} />
          </div>
        )}
        <AnimatePresence key={`user-activities-bar`}>
          {showActivityBar && isLoggedIn && <UserActivitiesBar />}
        </AnimatePresence>

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
        {checkLocation() && (
          <>
            <PrimeImage
              src={upperLeftGradient.src}
              alt="large-gradient"
              className="absolute top-0 left-24 w-[550px] h-[550px] -z-10 hidden sm:block"
            />
            <PrimeImage
              src={ovalGradient.src}
              alt="large-gradient"
              className="absolute top-24 right-24 -z-10 h-64 w-64 hidden sm:block"
            />
          </>
        )}

        <main
          className={`max-h-screen overflow-auto relative ${
            hydrated && isLoggedIn && !isCollapsed ? "w-full" : "w-full"
          }`}
        >
          {hidden && (
            <header
              className={`flex justify-between items-center backdrop-blur bg-slate-100/10 z-10 h-20 w-full absolute top-0 ${
                isCollapsed ? "ps-2 pe-4" : "ps-5 pe-4"
              }`}
            >
              <div className="flex gap-3">
                {isCollapsed && (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={
                      setIsCollapsed
                        ? () => setIsCollapsed(!isCollapsed)
                        : undefined
                    }
                    className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                  >
                    <Icon
                      icon="solar:close-circle-bold"
                      className="h-6 w-6 text-gray-600 dark:text-gray-400"
                    />
                  </motion.button>
                )}
                <motion.div
                  className="flex items-center gap-4"
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1, duration: 1 }}
                >
                  <Image
                    src={wmcLogo.src}
                    alt="wmc logo"
                    height="45"
                    width="45"
                  />
                  <div className="text-blue-600">
                    <h4 className="font-semibold text-xl">
                      Westlake Medical Center
                    </h4>
                  </div>
                </motion.div>
              </div>

              <div className="flex gap-1">
                {unreadVisible && (
                  <Button
                    tooltipOptions={{ position: "left" }}
                    icon={`${PrimeIcons.EXCLAMATION_CIRCLE} text-red-400 text-2xl`}
                    tooltip={unreadMessage}
                  />
                )}
                <HeaderIcons showPendingUsers={showPendingUsers} />
              </div>
            </header>
          )}
          <div
            className={`w-full h-screen  overflow-y-auto relative ${
              hydrated && isLoggedIn && "pt-20"
            }`}
          >
            {children}
          </div>
        </main>
        {isLoggedIn && hydrated && (
          <SpeedDial
            model={items}
            radius={120}
            type="linear"
            direction="up"
            className="bottom-5 right-5"
            showIcon="pi pi-sparkles"
            hideIcon="pi pi-times"
            pt={{
              button: {
                root: {
                  className:
                    "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 h-14 w-14 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-0 rounded-full backdrop-blur-sm",
                },
              },
              action: {
                className:
                  "bg-white/90 backdrop-blur-sm hover:bg-white h-12 w-12 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 border border-gray-200/50 rounded-full",
              },
              menu: {
                className: "gap-3",
              },
            }}
            transitionDelay={100}
          />
        )}
      </div>
    </QueryClientProvider>
  );
};

export default Divider;
