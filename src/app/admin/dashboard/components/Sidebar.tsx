"use client";
import { ABoardSelector } from "@/app/types/types";
import React, { ReactNode, useState } from "react";
import Graphs from "../pages/Graphs";
import Users from "../pages/Users";
import Posts from "../pages/Posts";
import Departments from "../pages/Departments";
import Comments from "../pages/Comments";
import Replies from "../pages/Replies";

const Sidebar = () => {
  const [selectedComp, setSelectedComp] = useState<ReactNode>(<Graphs />);
  const components: ABoardSelector[] = [
    {
      name: "Graphs",
      component: <Graphs />,
    },
    {
      name: "Users",
      component: <Users />,
    },
    {
      name: "Posts",
      component: <Posts />,
    },
    {
      name: "Departments",
      component: <Departments />,
    },
    {
      name: "Comments",
      component: <Comments />,
    },
    {
      name: "Replies",
      component: <Replies />,
    },
  ];

  return (
    <div className="flex w-full font-mono">
      <div className="bg-white dark:bg-neutral-900">
        <div className="px-5 pt-5 clear-start">INTRANET</div>
        <div className="flex flex-col gap-1 py-2 px-10 w-72">
          {components.map((comp, index) => (
            <div key={index}>
              <p
                className="cursor-pointer"
                onClick={() => setSelectedComp(comp.component)}
              >
                {comp.name}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="w-full bg-neutral-200 dark:bg-neutral-700 h-screen">
        <div className="">{selectedComp}</div>
      </div>
    </div>
  );
};

export default Sidebar;
