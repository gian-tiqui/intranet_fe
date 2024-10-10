import { Department } from "@/app/types/types";
import { Icon } from "@iconify/react/dist/iconify.js";
import React from "react";

const DepartmentsCard: React.FC<Department> = ({
  departmentName,
  users,
  posts,
}) => {
  const handleUsersClicked = () => {
    console.log(users);
  };

  const handlePostsClicked = () => {
    console.log(posts);
  };

  return (
    <div className="bg-white dark:bg-neutral-900 flex flex-col gap-2 items-center justify-center h-52 text-center rounded-xl">
      <p className="text-2xl font-bold">{departmentName}</p>
      <p className="text-sm">Users: {users.length}</p>
      <p className="text-sm mb-6">Posts: {posts.length}</p>
      <div className="flex justify-center gap-2 w-full">
        <button
          onClick={handleUsersClicked}
          className="flex items-center gap-2 bg-neutral-900 rounded-lg dark:bg-neutral-200 text-white dark:text-black px-3 py-1"
        >
          <Icon icon={"clarity:users-line"} className="w-6 h-6" />
          Users
        </button>
        <button
          onClick={handlePostsClicked}
          className="flex items-center gap-2 bg-neutral-900 rounded-lg dark:bg-neutral-200 text-white dark:text-black px-3 py-1"
        >
          <Icon icon={"material-symbols:post-outline"} className="w-6 h-6" />
          Posts
        </button>
      </div>
    </div>
  );
};

export default DepartmentsCard;
