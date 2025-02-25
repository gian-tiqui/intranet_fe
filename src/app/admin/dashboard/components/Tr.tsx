import SmallToLarge from "@/app/components/animation/SmallToLarge";
import { User } from "@/app/types/types";
import { Icon } from "@iconify/react/dist/iconify.js";
import { formatDate } from "date-fns";
import { AnimatePresence } from "framer-motion";
import userIdStore from "@/app/store/userId";
import React, { useEffect, useState } from "react";
import updateModalStore from "@/app/store/updateUserModal";
import useAdminHiderStore from "@/app/store/adminOpacitor";
import viewUserStore from "@/app/store/viewUser";
import deleteUserStore from "@/app/store/deleteUserModal";

const Tr: React.FC<User> = (user) => {
  const [showOptions, setShowOptions] = useState<boolean>(false);
  const { setSelectedId } = userIdStore();
  const { setUpdateModalShown } = updateModalStore();
  const { setAShown } = useAdminHiderStore();
  const { setViewUser } = viewUserStore();
  const { setShowDeleteModal } = deleteUserStore();

  const handleViewClicked = () => {
    setViewUser(true);
    setAShown(true);
    setSelectedId(user.id);
  };

  const handleUpdateClicked = () => {
    setUpdateModalShown(true);
    setAShown(true);
    setSelectedId(user.id);
  };

  const handleDeleteClicked = () => {
    setAShown(true);

    setShowDeleteModal(true);
  };

  useEffect(() => {
    const handleClick = () => {
      if (showOptions) {
        setShowOptions(false);
      }
    };

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, [showOptions]);

  return (
    <tr key={user.id} className="relative">
      <td
        className="py-4 px-4 border-b border-gray-300 dark:border-neutral-900
                   text-center"
      >
        {user.firstName}
      </td>
      <td
        className="py-4 px-4 border-b border-gray-300 dark:border-neutral-900
                   text-center"
      >
        {user.middleName}
      </td>
      <td
        className="py-4 px-4 border-b border-gray-300 dark:border-neutral-900
                   text-center"
      >
        {user.lastName}
      </td>
      <td
        className="py-4 px-4 border-b border-gray-300 dark:border-neutral-900
                   text-center"
      >
        {user.email}
      </td>
      <td
        className="py-4 px-4 border-b border-gray-300 dark:border-neutral-900
                   text-center"
      >
        {user.department.departmentName}
      </td>
      <td
        className="py-4 px-4 border-b border-gray-300 dark:border-neutral-900
                   text-center"
      >
        {" "}
         {formatDate(user.dob, "MMMM dd, yyyy")}
      </td>
      <td
        className="py-4 px-4 border-b border-gray-300 dark:border-neutral-900
                   text-center"
      >
        <Icon
          onClick={() => setShowOptions(!showOptions)}
          icon={"simple-line-icons:options"}
          className="mx-auto h-7 w-7 p-1 cursor-pointer hover:bg-gray-300 dark:hover:bg-neutral-600 rounded-full"
        />
        <AnimatePresence>
          {showOptions && (
            <SmallToLarge>
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedId(user.id);
                }}
                className="flex flex-col w-32 right-0 items-start p-2 absolute bg-neutral-200 border border-gray-300 rounded-lg dark:bg-neutral-800 dark:border-gray-900"
              >
                <button
                  onClick={handleViewClicked}
                  className="hover:bg-gray-300 px-2 dark:hover:bg-gray-900 rounded w-full py-2 flex items-center gap-1"
                >
                  <Icon icon={"hugeicons:view"} className="h-5 w-5" />
                  View
                </button>
                <button
                  onClick={handleUpdateClicked}
                  className="hover:bg-gray-300 px-2 dark:hover:bg-gray-900 rounded w-full py-2 flex items-center gap-1"
                >
                  <Icon icon={"bx:edit"} className="h-5 w-5" />
                  Update
                </button>
                <button
                  onClick={handleDeleteClicked}
                  className="hover:bg-gray-300 px-2 dark:hover:bg-gray-900 rounded w-full py-2 flex items-center gap-1"
                >
                  <Icon
                    icon={"material-symbols:delete-outline"}
                    className="h-5 w-5"
                  />
                  Delete
                </button>
              </div>
            </SmallToLarge>
          )}
        </AnimatePresence>
      </td>
    </tr>
  );
};

export default Tr;
