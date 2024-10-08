"use client";
import { ABoardSelector } from "@/app/types/types";
import React, { ReactNode, useState } from "react";
import Graphs from "../pages/Graphs";
import Users from "../pages/Users";
import Posts from "../pages/Posts";
import Departments from "../pages/Departments";
import Comments from "../pages/Comments";
import Replies from "../pages/Replies";
import { Icon } from "@iconify/react/dist/iconify.js";
import UserButton from "@/app/components/UserButton";
import useShowUserModalStore from "@/app/store/showUserModal";
import HoverBox from "@/app/components/HoverBox";
import { useRouter } from "next/navigation";

const Sidebar = () => {
  const [selectedComp, setSelectedComp] = useState<ReactNode>(<Graphs />);
  const { uVisible, setUVisible } = useShowUserModalStore();
  const router = useRouter();

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
      name: "Posts",
      component: <Posts />,
      icon: "material-symbols:post-outline",
    },
    {
      name: "Departments",
      component: <Departments />,
      icon: "arcticons:emoji-department-store",
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
  ];

  return (
    <div className="flex w-full font-mono">
      <div className="bg-white dark:bg-neutral-900 flex flex-col justify-between shadow">
        <div className="">
          <div className="px-5 pt-5 clear-start mb-6 font-extrabold text-2xl">
            INTRANET DASHBOARD
          </div>
          <hr className="mt-7 border-b border-gray-200 dark:border-gray-800 mb-2" />
          <HoverBox className="hover:bg-gray-300 mb-2 dark:hover:bg-neutral-800 p-2 cursor-pointer rounded mx-4">
            <div
              className="flex items-center gap-3"
              onClick={() => router.push("/")}
            >
              <Icon icon={"ph:hospital"} className="h-7 w-7" />
              <p className="w-full text-md">Intranet</p>
            </div>
          </HoverBox>
          <hr className="border-b border-gray-200 dark:border-gray-800 mx-4" />
          <div className="flex flex-col gap-0 py-2 px-4 w-72">
            {components.map((comp, index) => (
              <div
                key={index}
                className="flex items-center gap-2 hover:bg-gray-200 dark:hover:bg-neutral-800 rounded p-2"
              >
                <Icon icon={comp.icon} className="h-7 w-7" />
                <p
                  className="cursor-pointer"
                  onClick={() => setSelectedComp(comp.component)}
                >
                  {comp.name}
                </p>
              </div>
            ))}
          </div>
          <hr className="border-b border-gray-200 dark:border-gray-800 mx-4" />
        </div>
        <UserButton uVisible={uVisible} setUVisible={setUVisible} />
      </div>

      <div className="w-full bg-neutral-200 dark:bg-neutral-800 h-screen">
        <div className="">{selectedComp}</div>
      </div>
    </div>
  );
};

export default Sidebar;
