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
      <div>
        <div className="px-5 pt-5">INTRANET</div>
        <div className="flex flex-col gap-1 p-5 w-72">
          {components.map((comp, index) => (
            <p
              className="cursor-pointer"
              onClick={() => setSelectedComp(comp.component)}
              key={index}
            >
              {comp.name}
            </p>
          ))}
        </div>
      </div>

      <div className="w-full bg-neutral-200 dark:bg-neutral-700 h-screen">
        {selectedComp}
      </div>
    </div>
  );
};

export default Sidebar;
