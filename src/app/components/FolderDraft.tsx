import React, { useState } from "react";
import { Folder } from "../types/types";
import { Icon } from "@iconify/react";
import { Button } from "primereact/button";
import { Avatar } from "primereact/avatar";
import { Badge } from "primereact/badge";
import { Tooltip } from "primereact/tooltip";
import useEditFolderDialogVisibleStore from "../store/editFolderDialogVisible";
import useEditFolderIdStore from "../store/editFolderId";

interface Props {
  folder: Folder;
}

const FolderDraft: React.FC<Props> = ({ folder }) => {
  const { setEditFolderDialogVisible } = useEditFolderDialogVisibleStore();
  const { setEditFolderId } = useEditFolderIdStore();
  const [isHovered, setIsHovered] = useState(false);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getTimeAgo = (date: string) => {
    const now = new Date();
    const createdDate = new Date(date);
    const diffTime = Math.abs(now.getTime() - createdDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "Today";
    if (diffDays === 2) return "Yesterday";
    if (diffDays <= 7) return `${diffDays} days ago`;
    if (diffDays <= 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return `${Math.ceil(diffDays / 30)} months ago`;
  };

  const handleEdit = () => {
    console.log("edit");
    setEditFolderDialogVisible(true);
    setEditFolderId(folder.id);
  };

  const generateAvatarColors = (index: number) => {
    const colors = [
      "bg-blue-500",
      "bg-green-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-orange-500",
    ];
    return colors[index % colors.length];
  };

  return (
    <div
      className={`group relative w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer ${
        isHovered
          ? "shadow-xl shadow-blue-500/10 dark:shadow-blue-400/10 border-blue-300 dark:border-blue-600 scale-[1.02]"
          : "shadow-sm hover:shadow-lg hover:shadow-gray-200/50 dark:hover:shadow-gray-900/50"
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Status Badge */}
      <div className="absolute top-4 right-4 z-10">
        <Badge
          value="Draft"
          severity="warning"
          className="bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-200 text-xs font-medium px-3 py-1 rounded-full"
        />
      </div>

      {/* Main Content */}
      <div className="p-6">
        {/* Header Section */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <Icon icon="mdi:folder" className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-amber-500 rounded-full flex items-center justify-center">
                <Icon icon="mdi:pencil" className="w-2.5 h-2.5 text-white" />
              </div>
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-900 dark:text-white truncate max-w-[12rem] mb-1">
                {folder.name}
              </h3>
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <Icon icon="mdi:clock-outline" className="w-4 h-4" />
                <span>{getTimeAgo(folder.createdAt)}</span>
                <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                <span>{formatDate(folder.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Collaborators Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <Icon icon="mdi:account-group" className="w-4 h-4" />
              Departments/Division
            </h4>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {folder.folderDepartments?.length ?? 0} departments
            </span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {folder.folderDepartments?.slice(0, 5).map((fd, index) => (
              <div key={fd.id} className="relative">
                <Avatar
                  label={
                    fd.department?.departmentName
                      ? fd.department.departmentName.charAt(0)
                      : "?"
                  }
                  shape="circle"
                  className={`w-10 h-10 ${generateAvatarColors(
                    index
                  )} text-white text-sm font-medium border-2 border-white dark:border-gray-800 shadow-sm`}
                />
                <Tooltip
                  target={`.collab-${fd.id}`}
                  content={fd.department?.departmentName ?? "Unknown"}
                  position="top"
                />
                <div
                  className={`collab-${fd.id} absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full`}
                ></div>
              </div>
            ))}

            {folder.folderDepartments &&
              folder.folderDepartments.length > 5 && (
                <Avatar
                  label={`+${folder.folderDepartments.length - 5}`}
                  shape="circle"
                  className="w-10 h-10 bg-gray-400 dark:bg-gray-600 text-white text-sm font-medium border-2 border-white dark:border-gray-800 shadow-sm"
                />
              )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <Button
            className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            onClick={() => console.log("Publish folder")}
          >
            <Icon icon="mdi:publish" className="w-4 h-4" />
            <span>Publish</span>
          </Button>

          <Tooltip target=".edit-button" content="Edit Folder" position="top" />
          <Button
            className="edit-button w-12 h-12 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-sm hover:shadow-md flex items-center justify-center"
            onClick={handleEdit}
          >
            <Icon icon="mdi:cog" className="w-5 h-5" />
          </Button>

          <Tooltip
            target=".more-button"
            content="More Options"
            position="top"
          />
        </div>
      </div>

      {/* Hover Overlay Effect */}
      <div
        className={`pointer-events-none absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 transition-opacity duration-300 ${
          isHovered ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
};

export default FolderDraft;
