"use client";
import ModeToggler from "@/app/components/ModeToggler";
import useAdminPosts from "@/app/custom-hooks/adminPost";
import useComments from "@/app/custom-hooks/comments";
import useDepartments from "@/app/custom-hooks/departments";
import useReplies from "@/app/custom-hooks/replies";
import useUsers from "@/app/custom-hooks/users";
import {
  aggregateCommentsPerPost,
  aggregatePostsByDay,
  aggregatePostsByMonth,
  aggregatePostsByYear,
  aggregateReadersPerPost,
  fetchUsersWithIncompleteReads,
} from "@/app/functions/functions";
import {
  CommentsProp,
  Department,
  DepartmentUserCount,
  Post,
  PostComment,
} from "@/app/types/types";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useQuery } from "@tanstack/react-query";
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
  Cell,
  Legend,
} from "recharts";

interface PostsBarProps {
  departments: Department[];
}

const PostsBarChart: React.FC<PostsBarProps> = ({ departments }) => {
  const data = [
    ...departments.map((dept) => ({
      department: dept.departmentCode,
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

  const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

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
          label
        >
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={getRandomColor()} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
};

const CommentsPerPostBarChart: React.FC<{ comments: PostComment[] }> = ({
  comments,
}) => {
  const data = aggregateCommentsPerPost(comments);
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="postId"
          label={{
            value: "Post ID",
            position: "insideBottomRight",
            offset: -5,
          }}
        />
        <YAxis
          label={{ value: "Comments", angle: -90, position: "insideLeft" }}
        />
        <Tooltip />
        <Bar dataKey="count" fill="#82ca9d" />
      </BarChart>
    </ResponsiveContainer>
  );
};

const ReadersPerPostBarChart: React.FC<{ posts: Post[] }> = ({ posts }) => {
  const data = aggregateReadersPerPost(posts);
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="postId"
          label={{
            value: "Post ID",
            position: "insideBottomRight",
            offset: -5,
          }}
        />
        <YAxis
          label={{ value: "Readers", angle: -90, position: "insideLeft" }}
        />
        <Tooltip />
        <Bar dataKey="readers" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );
};

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

const UsersIncompleteReadsGraph: React.FC = () => {
  const { data, error, isLoading } = useQuery<DepartmentUserCount[]>({
    queryKey: ["users-with-incomplete-reads"],
    queryFn: fetchUsersWithIncompleteReads,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error fetching user count data</div>;
  }

  return (
    <div className="w-full bg-white dark:bg-neutral-900 p-5 shadow mt-5">
      <h1 className="text-2xl font-bold mb-5">
        Count of Users with Incomplete Reads Per Department
      </h1>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <XAxis dataKey="departmentName" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="userCount" fill="#8884d8" name="User Count" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

const LineGraph: React.FC<{
  data: { date: string; count: number }[];
  title: string;
}> = ({ data, title }) => (
  <div className="w-full bg-white dark:bg-neutral-900 p-5 shadow mt-5">
    <h1 className="text-2xl font-bold mb-5">{title}</h1>
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="count" stroke="#8884d8" />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

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
  const posts = useAdminPosts();
  const replies = useReplies();

  const dailyData = aggregatePostsByDay(posts);
  const monthlyData = aggregatePostsByMonth(posts);
  const yearlyData = aggregatePostsByYear(posts);

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

        <UsersIncompleteReadsGraph />

        <div className="w-full bg-white dark:bg-neutral-900 p-5 shadow mt-1">
          <h1 className="text-2xl font-bold mb-10">Comments over time</h1>

          <PostCommentsLineChart comments={comments} />
        </div>

        {/* 4th row */}

        <div className="w-full bg-white dark:bg-neutral-900 p-5 shadow mt-1">
          <h1 className="text-2xl font-bold mb-10">Replies over time</h1>

          <PostCommentsLineChart comments={replies} />
        </div>

        <div className="w-full bg-white dark:bg-neutral-900 p-5 shadow mt-1">
          <h1 className="text-2xl font-bold mb-10">Comments per Post</h1>
          <CommentsPerPostBarChart comments={comments} />
        </div>

        <div className="w-full bg-white dark:bg-neutral-900 p-5 shadow mt-1">
          <h1 className="text-2xl font-bold mb-10">Readers per Post</h1>
          <ReadersPerPostBarChart posts={posts} />
        </div>

        <div>
          <LineGraph data={dailyData} title="Posts Per Day" />
          <LineGraph data={monthlyData} title="Posts Per Month" />
          <LineGraph data={yearlyData} title="Posts Per Year" />
        </div>
      </div>
    </div>
  );
};

export default Graphs;
