"use client";
import ModeToggler from "@/app/components/ModeToggler";
import useComments from "@/app/custom-hooks/comments";
import useDepartments from "@/app/custom-hooks/departments";
import usePosts from "@/app/custom-hooks/posts";
import useReplies from "@/app/custom-hooks/replies";
import useUsers from "@/app/custom-hooks/Users"; // ???
import React, { useEffect } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  AreaChart,
  Area,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Page A", uv: 400, pv: 2400, amt: 3400 },
  { name: "Page B", uv: 500, pv: 2500, amt: 200 },
  { name: "Page C", uv: 600, pv: 2000, amt: 2400 },
];

const pieData = [
  { name: "Group A", value: 400 },
  { name: "Group B", value: 300 },
  { name: "Group C", value: 300 },
  { name: "Group D", value: 200 },
];

const Graphs = () => {
  const comments = useComments();
  const users = useUsers();
  const departments = useDepartments();
  const posts = usePosts();
  const replies = useReplies();

  useEffect(() => {
    console.table(comments);
    console.table(users);
    console.table(departments);
    console.table(posts);
  }, [comments, users, departments, posts, replies]);

  return (
    <div className="w-full h-screen overflow-auto">
      {/*
       *
       * THIS IS THE HEADER SECTION OF THE GRAPH COMPONENT
       *
       */}

      <div className="w-full h-20 border-b border-gray-300 dark:border-neutral-900 flex justify-between px-2 items-center">
        <div></div>
        <ModeToggler />
      </div>

      {/*
       *
       * THIS IS THE GRAPHS SECTION OF THE GRAPH COMPONENT
       *
       */}

      <div className="w-full p-3">
        {/* FIRST ROW */}
        <div className="grid h-52 grid-cols-3 gap-1 mb-1">
          {/* FIRST COLUMN */}

          <div className="grid grid-cols-3 col-span-2 gap-1">
            <div className="w-full bg-white border border-gray-300 dark:border-neutral-900 dark:bg-neutral-800 shadow">
              <div className="w-full h-full"></div>
            </div>

            <div className="w-full bg-white border border-gray-300 dark:border-neutral-900 dark:bg-neutral-800 shadow">
              <div className="w-full h-full"></div>
            </div>

            <div className="w-full bg-white border border-gray-300 dark:border-neutral-900 dark:bg-neutral-800 shadow">
              <div className="w-full h-full"></div>
            </div>
          </div>

          {/* SECOND COLUMN */}

          <div className="w-full bg-white border border-gray-300 dark:border-neutral-900 dark:bg-neutral-800 shadow">
            <div className="w-full h-full"></div>
          </div>
        </div>

        <div className="grid h-96 grid-cols-3 gap-1 mb-1">
          <div className="grid grid-cols-3 gap-1">
            {Array(9)
              .fill(0)
              .map((_, index) => (
                <div
                  key={index}
                  className="w-full bg-white border border-gray-300 dark:border-neutral-900 dark:bg-neutral-800 shadow"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        label
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ))}
          </div>
          <div className="w-full bg-white border border-gray-300 dark:border-neutral-900 dark:bg-neutral-800 shadow">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <Area
                  type="monotone"
                  dataKey="amt"
                  stroke="#8884d8"
                  fill="#8884d8"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="w-full bg-white border border-gray-300 dark:border-neutral-900 dark:bg-neutral-800 shadow">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <Bar dataKey="pv" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid h-96 grid-cols-3 gap-1 bg-white border border-gray-300 dark:border-neutral-900 dark:bg-neutral-800 shadow">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <Line type="monotone" dataKey="uv" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Graphs;
