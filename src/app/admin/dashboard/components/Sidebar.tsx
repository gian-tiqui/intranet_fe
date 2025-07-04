"use client";
import { ABoardSelector } from "@/app/types/types";
import React, { ReactNode, useState } from "react";
import Graphs from "../pages/Graphs";
import Users from "../pages/Users";
import Posts from "../pages/Posts";
import Comments from "../pages/Comments";
import Replies from "../pages/Replies";
import { Icon } from "@iconify/react/dist/iconify.js";
import UserButton from "@/app/components/UserButton";
import HoverBox from "@/app/components/HoverBox";
import { useRouter } from "next/navigation";
import useAdminHiderStore from "@/app/store/adminOpacitor";
import AddUserModal from "./AddUserModal";
import UpdateUserModal from "./UpdateUserModa";
import addModalStore from "@/app/store/addPostModal";
import updateModalStore from "@/app/store/updateUserModal";
import viewUserStore from "@/app/store/viewUser";
import ViewUserData from "./ViewUserData";
import deleteUserStore from "@/app/store/deleteUserModal";
import DeleteModal from "./DeleteModal";
import useDeletePostStore from "@/app/store/deletePost";
import DeletePostModal from "./DeletePostModal";
import { motion } from "framer-motion";
import Departments from "../pages/Departments";

const Sidebar = () => {
  const [selectedComp, setSelectedComp] = useState<ReactNode>(<Graphs />);
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const router = useRouter();
  const { aShown, setAShown } = useAdminHiderStore();
  const { addModalShown, setAddModalShown } = addModalStore();
  const { updateModalShown, setUpdateModalShown } = updateModalStore();
  const { viewUser, setViewUser } = viewUserStore();
  const { showDeleteModal, setShowDeleteModal } = deleteUserStore();
  const { deletePostModalShown, setDeletePostModalShown } =
    useDeletePostStore();
  const [isMobile] = useState<boolean>(false);

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

  // Sidebar items that will change the children component.
  const components: ABoardSelector[] = [
    {
      name: "Graphs",
      component: <Graphs />,
      icon: "mdi:graph-line",
    },
    {
      name: "Users",
      component: <Users />,
      icon: "clarity:users-line",
    },
    {
      name: "Departments",
      component: <Departments />,
      icon: "f7:building",
    },
    {
      name: "Posts",
      component: <Posts />,
      icon: "material-symbols:post-outline",
    },

    {
      name: "Comments",
      component: <Comments />,
      icon: "material-symbols:comment-outline",
    },
    {
      name: "Replies",
      component: <Replies />,
      icon: "mingcute:comment-line",
    },

    // {
    //   name: "User Edit Logs",
    //   component: <UserEditLogs />,
    //   icon: "mingcute:comment-line",
    // },
    // {
    //   name: "Post Edit Logs",
    //   component: <PostEditLog />,
    //   icon: "mingcute:comment-line",
    // },
    // {
    //   name: "Comment Edit Logs",
    //   component: <CommentEditLog />,
    //   icon: "mingcute:comment-line",
    // },
    // {
    //   name: "Change Password Logs",
    //   component: <ChangePasswordLog />,
    //   icon: "mingcute:comment-line",
    // },
  ];

  const handleHiderClicked = () => {
    setAShown(!aShown);
    setAddModalShown(false);
    setUpdateModalShown(false);
    setViewUser(false);
    setShowDeleteModal(false);
    setDeletePostModalShown(false);
  };

  return (
    <div className="flex w-full font-mono">
      {aShown && (
        <div
          onClick={handleHiderClicked}
          className="w-full h-screen bg-black/85 absolute z-20 flex justify-center items-center"
        >
          <div onClick={(e) => e.stopPropagation()}>
            {addModalShown && <AddUserModal />}
            {updateModalShown && <UpdateUserModal />}
            {viewUser && <ViewUserData />}
            {showDeleteModal && <DeleteModal />}
            {deletePostModalShown && <DeletePostModal />}
          </div>
        </div>
      )}

      {!collapsed && (
        <motion.div
          initial="collapsed"
          animate="open"
          exit="collapsed"
          variants={variants}
          className="bg-white dark:bg-neutral-800 flex flex-col justify-between shadow"
        >
          <div className="">
            <div className="px-6 pt-5 clear-start mb-6 font-extrabold text-2xl gap-3 flex items-center">
              <Icon icon={"file-icons:dashboard"} />
              <p>DASHBOARD</p>
            </div>
            <hr className="mt-7 border-b border-gray-200 dark:border-neutral-700 mb-2" />
            <HoverBox className="hover:bg-gray-300 mb-2 dark:hover:bg-neutral-800 p-2 cursor-pointer rounded mx-4">
              <div
                className="flex items-center gap-3"
                onClick={() => router.push("/")}
              >
                <Icon icon={"ph:hospital"} className="h-7 w-7" />
                <p className="w-full text-md">Home</p>
              </div>
            </HoverBox>
            <hr className="border-b border-gray-200 dark:border-neutral-700 mx-4" />
            <div className="flex flex-col gap-0 py-2 px-4 w-72 h-72 overflow-auto">
              {components.map((comp, index) => (
                <div
                  onClick={() => setSelectedComp(comp.component)}
                  key={index}
                  className="flex items-center gap-2 hover:bg-gray-200 dark:hover:bg-neutral-800 rounded p-2"
                >
                  <Icon icon={comp.icon} className="h-7 w-7" />
                  <p className="cursor-pointer">{comp.name}</p>
                </div>
              ))}
            </div>
            <hr className="border-b border-gray-200 dark:border-neutral-700 mx-4" />
          </div>
          <UserButton />
        </motion.div>
      )}

      <div className="w-full bg-neutral-200 dark:bg-neutral-900 h-screen relative">
        <div
          onClick={() => setCollapsed(!collapsed)}
          className={`absolute top-0 left-0 h-7 w-8 rounded-ee bg-white grid place-content-center dark:bg-neutral-900`}
        >
          <Icon
            icon={"fluent:ios-arrow-24-filled"}
            className={`h-5 w-5 ${collapsed && "rotate-180"}`}
          />
        </div>
        <div className="">{selectedComp}</div>
      </div>
    </div>
  );
};

export default Sidebar;
