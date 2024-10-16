"use client";
import ModeToggler from "@/app/components/ModeToggler";
import useComments from "@/app/custom-hooks/comments";
import useDepartments from "@/app/custom-hooks/departments";
import usePosts from "@/app/custom-hooks/posts";
import useReplies from "@/app/custom-hooks/replies";
import useUsers from "@/app/custom-hooks/users";
import { Department, Post, PostComment, User } from "@/app/types/types";
import { Icon } from "@iconify/react/dist/iconify.js";
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Line,
  LineChart,
} from "recharts";

interface PostsBarProps {
  departments: Department[];
}

const PostsBarChart: React.FC<PostsBarProps> = ({ departments }) => {
  const data = [
    ...departments.map((dept) => ({
      department: dept.departmentName,
      posts: dept.posts.length,
    })),
  ];

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="department" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="posts" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );
};

const UsersPieChart: React.FC<PostsBarProps> = ({ departments }) => {
  const data = departments.map((dept) => ({
    department: dept.departmentName,
    posts: dept.users.length,
  }));

  return (
    <ResponsiveContainer width="100%" height={400}>
      <PieChart>
        <Pie
          data={data}
          dataKey="posts"
          nameKey="department"
          cx="50%"
          cy="50%"
          outerRadius={100}
          fill="#8884d8"
          label
        />
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
};

interface CommentsProp {
  comments: PostComment[];
}

const CommentsBarChart: React.FC<CommentsProp> = () => {
  return <div></div>;
};

interface RepliesProp {
  replies: PostComment[];
}

const RepliesBarChart: React.FC<RepliesProp> = () => {
  return <div></div>;
};

interface CommentsProp {
  comments: {
    cid: number;
    userId: number;
    postId: number;
    parentId: number;
    message?: string;
    imageLocation?: string;
    createdAt: Date;
    updatedAt: Date;
    user: User;
    post: Post;
    replies?: PostComment[];
  }[];
}

const aggregateCommentsByDate = (comments: CommentsProp["comments"]) => {
  const countByDate: Record<string, number> = {};

  comments.forEach((comment) => {
    const date = new Date(comment.createdAt).toLocaleDateString();
    countByDate[date] = (countByDate[date] || 0) + 1;
  });

  return Object.entries(countByDate).map(([date, count]) => ({
    date,
    count,
  }));
};

const PostCommentsLineChart: React.FC<{ comments: PostComment[] }> = ({
  comments,
}) => {
  const aggregatedData = aggregateCommentsByDate(comments);

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={aggregatedData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="count" stroke="#8884d8" />
      </LineChart>
    </ResponsiveContainer>
  );
};

const Graphs = () => {
  const comments = useComments();
  const users = useUsers();
  const departments = useDepartments();
  const posts = usePosts();
  const replies = useReplies();

  return (
    <div className="w-full h-screen overflow-auto">
      {/*
       *
       * THIS IS THE HEADER SECTION OF THE GRAPH COMPONENT
       *
       */}

      <div className="w-full h-20 border-b border-gray-300 dark:border-neutral-900 flex justify-between px-3 items-center">
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
        <div className="grid h-28 grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-1 mb-1">
          {/* FIRST COLUMN */}

          <div className="w-full font-extrabold h-full p-4 grid place-content-center bg-white border border-gray-300 dark:border-neutral-900 dark:bg-neutral-900 shadow">
            <div className="flex gap-2 items-center">
              <Icon className="h-5 w-5" icon={"clarity:users-line"} />
              <h1 className="text-center">USERS</h1>
            </div>
            <p className="text-center">{users.length}</p>
          </div>

          <div className="w-full font-extrabold h-full p-4 grid place-content-center bg-white border border-gray-300 dark:border-neutral-900 dark:bg-neutral-900 shadow">
            <div className="flex gap-2 items-center">
              <Icon
                className="h-5 w-5"
                icon={"material-symbols:post-outline"}
              />
              <h1 className="text-center">POSTS</h1>
            </div>
            <p className="text-center">{posts.length}</p>
          </div>

          <div className="w-full font-extrabold h-full p-4 grid place-content-center bg-white border border-gray-300 dark:border-neutral-900 dark:bg-neutral-900 shadow">
            <div className="flex gap-2 items-center">
              <Icon
                className="h-5 w-5"
                icon={"arcticons:emoji-department-store"}
              />
              <h1 className="text-center">DEPARTMENTS</h1>
            </div>
            <p className="text-center">{departments.length}</p>
          </div>

          <div className="w-full font-extrabold h-full p-4 grid place-content-center bg-white border border-gray-300 dark:border-neutral-900 dark:bg-neutral-900 shadow">
            <div className="flex gap-2 items-center">
              <Icon className="h-5 w-5" icon={"mdi:comments-outline"} />
              <h1 className="text-center">COMMENTS</h1>
            </div>
            <p className="text-center">{comments.length}</p>
          </div>

          <div className="w-full font-extrabold h-full p-4 grid place-content-center bg-white border border-gray-300 dark:border-neutral-900 dark:bg-neutral-900 shadow">
            <div className="flex gap-2 items-center">
              <Icon className="h-5 w-5" icon={"mingcute:comment-line"} />
              <h1 className="text-center">REPLIES</h1>
            </div>
            <p className="text-center">{replies.length}</p>
          </div>
        </div>

        {/* 2nd row */}

        <div className="grid md:grid-cols-3 mt-1 gap-1">
          <div className="md:col-span-2 bg-white dark:bg-neutral-900 p-5 shadow">
            <h1 className="text-2xl font-bold mb-10">Posts</h1>
            <PostsBarChart departments={departments} />
          </div>
          <div className="md:col-span-1 bg-white dark:bg-neutral-900 p-5 shadow">
            <h1 className="text-2xl font-bold mb-10">Users</h1>

            <UsersPieChart departments={departments} />
          </div>
        </div>

        {/* 3rd row */}

        <div className="w-full font-extrabold h-full mt-1 p-4 bg-white border border-gray-300 dark:border-neutral-900 dark:bg-neutral-900 shadow">
          <h1 className="text-2xl font-bold mb-10">Comments over time</h1>

          <PostCommentsLineChart comments={comments} />
        </div>

        {/* 4th row */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
          <div className="w-full bg-white dark:bg-neutral-900 p-5 shadow mt-1">
            <h1 className="text-2xl font-bold mb-10">Comments</h1>

            <CommentsBarChart comments={comments} />
          </div>
          <div className="w-full bg-white dark:bg-neutral-900 p-5 shadow mt-1">
            <h1 className="text-2xl font-bold mb-10">Replies</h1>

            <RepliesBarChart replies={replies} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Graphs;
