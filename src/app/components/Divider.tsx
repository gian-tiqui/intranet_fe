"use client";
import React, { ReactNode, useEffect, useState } from "react";
import useNavbarVisibilityStore from "../store/navbarVisibilityStore";
import useToggleStore from "../store/navbarCollapsedStore";
import { AnimatePresence } from "framer-motion";
import Aside from "./Aside";
import PostModal from "../posts/components/PostModal";
import useShowPostStore from "../store/showPostStore";
import Settings from "./Settings";
import useShowSettingsStore from "../store/showSettingStore";
import LoginSplash from "./RefreshSplashArt";
import useSplashToggler from "../store/useSplashStore";
import useEditModalStore from "../store/editModal";
import EditPostModal from "../posts/components/EditModal";
import usePostIdStore from "../store/postId";
import { checkDept, decodeUserData } from "../functions/functions";
import wmcLogo from "../assets/westlake_logo_horizontal.jpg.png";
import { toast } from "react-toastify";
import { API_BASE, INTRANET } from "../bindings/binding";
import apiClient from "../http-common/apiUrl";
import { toastClass } from "../tailwind-classes/tw_classes";
import DeleteCommentPopup from "../posts/components/DeleteCommentPopup";
import showDeleteCommentModalStore from "../store/deleteComment";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import useDeleteModalStore from "../store/deleteModalStore";
import DeleteModal from "../posts/components/DeleteModal";
import useTokenStore from "../store/tokenStore";
import useOpenCreateFolderMainStore from "../store/createMainFolder";
import MainFolderModal from "../qm-portal/components/MainFolderModal";
import useSubFolderStore from "../store/createSubFolder";
import SubFolderModal from "../qm-portal/components/SubFolderModal";
import deleteFolderStore from "../store/deleteFolder";
import DeleteFolderModal from "../qm-portal/components/DeleteFolderModal";
import { Dialog } from "primereact/dialog";
import useUpdateDialogStore from "../store/updateDialogStore";
import { ConfirmDialog } from "primereact/confirmdialog";
import Image from "next/image";
import ovalGradient from "../assets/oval-gradient.png";
import upperLeftGradient from "../assets/upper-left-gradient.png";
import { Image as PrimeImage } from "primereact/image";
import { usePathname } from "next/navigation";
import HeaderIcons from "./HeaderIcons";
import UserActivitiesBar from "./UserActivitiesBar";
import useActivityBarStore from "../store/activitybar";
import { Button } from "primereact/button";
import useLoginStore from "../store/loggedInStore";
import SearchContainer from "./SearchContainer";
import { SpeedDial } from "primereact/speeddial";
import useAddFolderStore from "../store/addFolderDialog";
import { PrimeIcons } from "primereact/api";
import useShowSearchStore from "../store/showSearch";
import UserProfileDialog from "./UserProfileDialog";

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
  const { openCreateFolderModal } = useOpenCreateFolderMainStore();
  const { openSubFolder } = useSubFolderStore();
  const { showDeleteFolderModal } = deleteFolderStore();
  const { updatedDialogShown, setUpdateDialogShown } = useUpdateDialogStore();
  const { isLoggedIn } = useLoginStore();
  const [hydrated, setHydrated] = useState<boolean>(false);
  const { setAddFolderDialogVisible } = useAddFolderStore();
  const { showSearch } = useShowSearchStore();

  const items = [
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
      if (editVisible) setEditVisible(false);
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
        toast(response.data.message, { type: "error", className: toastClass });
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

  const checkLocation = () => {
    const locations = ["welcome", "login", "forgot-password"];

    return !locations.some((location) => pathname.includes(location));
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ConfirmDialog
        pt={{
          header: { className: "dark:bg-neutral-900 dark:text-white" },
          content: { className: "dark:bg-neutral-900" },
          footer: { className: "dark:bg-neutral-900" },
          acceptButton: { className: "ms-2 w-20 h-8" },
          rejectButton: { className: "ms-2 w-20 bg-red-400 h-8" },
        }}
      />
      <Dialog
        visible={updatedDialogShown}
        onHide={() => {
          if (updatedDialogShown === true) setUpdateDialogShown(false);
        }}
        pt={{
          header: { className: "bg-neutral-100" },
          content: { className: "bg-neutral-100" },
        }}
        header="WMC Employee Portal Updates"
        className="h-[70vh] w-[50%]"
      >
        <div className="w-full h-full bg-neutral-200 rounded p-4">
          <p className="font-semibold">
            {" "}
            <i className={`pi pi-wrench me-2`}></i>Bug Fixes
          </p>
          <ul className="mb-4">
            <li className="list-item">
              - PDF Page Structure fixed upon uploading
            </li>
            <li className="list-item">
              - User will now be able to login properly without any errors
              appearing.
            </li>
          </ul>
          <p className="font-semibold">
            <i className={`pi pi-sparkles me-2`}></i>Changes
          </p>
          <ul className="mb-4">
            <li className="list-item">- Masks does not close post/edit form</li>
            <li className="list-item">
              - Added select and remove all button in department selection
              dropdown
            </li>
            <li className="list-item">
              - User deactivation has been moved (FOR IT users)
            </li>
            <li>
              - Landing page after login was renovated to view organized folders
            </li>
          </ul>
        </div>
      </Dialog>
      <UserProfileDialog />
      <div className="flex h-screen text-neutral-800 dark:text-neutral-100">
        {showSearch && <SearchContainer />}
        {visible && <PostModal isMobile={isMobile} />}
        {shown && <Settings />}
        {showSplash && <LoginSplash />}
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

        {openCreateFolderModal && <MainFolderModal />}
        {openSubFolder && <SubFolderModal />}
        {showDeleteFolderModal && <DeleteFolderModal />}

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
              className="absolute top-0 left-24 w-[550px] h-[550px] -z-10"
            />
            <PrimeImage
              src={ovalGradient.src}
              alt="large-gradient"
              className="absolute top-24 right-24 -z-10 h-64 w-64"
            />
          </>
        )}

        <main
          className={`max-h-screen overflow-auto relative ${
            hydrated && isLoggedIn && !isCollapsed ? "w-[80%]" : "w-full"
          }`}
        >
          {hidden && (
            <header
              className={`flex justify-between items-center backdrop-blur bg-slate-100/10 z-10 h-20 ${
                !isCollapsed ? "w-[80%]" : "w-full"
              } fixed pe-10 top-0 ${isCollapsed ? "ps-2" : "ps-5"} pe-10`}
            >
              <div className="flex gap-3">
                {isCollapsed && (
                  <Button
                    tooltip="Expand Sidebar"
                    icon={`pi pi-expand`}
                    onClick={() => setIsCollapsed(false)}
                  />
                )}
                <div className="flex items-center gap-4">
                  <Image
                    src={wmcLogo.src}
                    alt="wmc logo"
                    height="45"
                    width="45"
                  />
                  <div className="text-blue-600">
                    <h4 className="font-semibold text-xl">Westlake</h4>
                    <h6 className="text-xs font-semibold">Medical Center</h6>
                  </div>
                </div>
              </div>

              <HeaderIcons showPendingUsers={showPendingUsers} />
            </header>
          )}
          <div
            className={`mx-auto w-full relative ${
              hydrated && isLoggedIn && "pt-20"
            } ${hidden && "max-w-[750px]"} px-3 md:px-0`}
          >
            {children}
          </div>
        </main>
        {editVisible && isLoggedIn && hydrated && (
          <SpeedDial
            model={items}
            radius={120}
            type="linear"
            direction="up"
            className="bottom-5 right-5"
            showIcon={`pi pi-sparkles`}
            hideIcon={`pi pi-times`}
            pt={{
              button: {
                root: { className: "bg-white h-10 w-10" },
              },
              action: { className: "bg-white h-10 w-10" },
            }}
          />
        )}
      </div>
    </QueryClientProvider>
  );
};

export default Divider;
