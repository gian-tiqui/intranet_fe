import React, { useState } from "react";
import { Image } from "primereact/image";
import { Button } from "primereact/button";
import { OverlayPanel } from "primereact/overlaypanel";
import { PrimeIcons } from "primereact/api";
import { Folder } from "../types/types";

interface Props {
  subfolder: Folder;
  setVisible: (visible: boolean) => void;
  handleSubfolderClick: (subfolderId: number) => void;
  checkDept: () => boolean;
  overlayPanelsRef: React.MutableRefObject<{
    [key: number]: OverlayPanel | null;
  }>;
  setOverlayPanelRef: (id: number) => (el: OverlayPanel | null) => void;
  handleEditClick: (folderId: number) => void;
  handleDeleteClick: (folderId: number) => void;
  blueFolder: {
    src: string;
    height?: number;
    width?: number;
    blurDataURL?: string;
    blurWidth?: number;
    blurHeight?: number;
  };
}

const ModernSubfolderContainer: React.FC<Props> = ({
  subfolder,
  setVisible,
  handleSubfolderClick,
  checkDept,
  overlayPanelsRef,
  setOverlayPanelRef,
  handleEditClick,
  handleDeleteClick,
  blueFolder,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      key={subfolder.id}
      onClick={() => {
        setVisible(false);
        handleSubfolderClick(subfolder.id);
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative h-36 cursor-pointer rounded-2xl overflow-hidden
                 transform transition-all duration-300 ease-out
                 hover:scale-[1.02] hover:-translate-y-1 hover:shadow-2xl
                 bg-gradient-to-br from-white via-slate-50 to-slate-100
                 border border-slate-200/50 backdrop-blur-sm"
      style={{
        background: isHovered
          ? "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)"
          : "linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%)",
      }}
    >
      {/* Animated background pattern */}
      <div
        className="absolute inset-0 opacity-5 group-hover:opacity-15 transition-opacity duration-300"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000' fill-opacity='0.1'%3E%3Cpath d='M20 20c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm10 0c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10z'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Glowing edge effect */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 
                      transition-opacity duration-300 pointer-events-none"
        style={{
          boxShadow:
            "inset 0 1px 0 rgba(255,255,255,0.3), 0 25px 50px rgba(59,130,246,0.15)",
        }}
      />

      {/* Content wrapper */}
      <div className="relative z-10 h-full flex flex-col p-4">
        {/* Top section with folder icon and settings */}
        <div className="flex items-start justify-between w-full mb-3">
          {/* Folder icon container - Made much smaller */}
          <div
            className={`p-1.5 sm:p-2 rounded-lg transition-all duration-300 ${
              isHovered
                ? "bg-white/20 shadow-lg backdrop-blur-sm scale-110"
                : "bg-blue-50 shadow-sm"
            }`}
          >
            <div className="relative">
              <Image
                src={blueFolder.src}
                className={`!h-4 !w-4 sm:!h-5 sm:!w-5 transition-all duration-300 ${
                  isHovered ? "brightness-0 invert" : ""
                }`}
                height={"15%"}
                width={"15%"}
                alt="blue-folder"
              />
              {/* Pulse animation on hover */}
              {isHovered && (
                <div className="absolute inset-0 bg-white/30 rounded animate-pulse" />
              )}
            </div>
          </div>

          {/* Settings button - Made smaller */}
          {checkDept() && (
            <div
              className={`transition-all duration-300 ${
                isHovered ? "opacity-100 scale-100" : "opacity-70 scale-95"
              }`}
            >
              <Button
                icon={`${PrimeIcons.COG}`}
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full justify-center border-0 shadow-lg transition-all duration-300 ${
                  isHovered
                    ? "bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm"
                    : "bg-white text-slate-600 hover:bg-slate-50"
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  overlayPanelsRef.current[subfolder.id]?.toggle(e);
                }}
              >
                <OverlayPanel
                  ref={setOverlayPanelRef(subfolder.id)}
                  className="modern-overlay-panel"
                  pt={{
                    root: {
                      className:
                        "rounded-xl shadow-2xl border-0 bg-white/95 backdrop-blur-lg p-2",
                    },
                  }}
                >
                  <div className="flex flex-col gap-1">
                    <Button
                      icon={`${PrimeIcons.USER_EDIT}`}
                      className="flex items-center gap-3 p-3 text-left rounded-lg
                                 bg-transparent hover:bg-blue-50 text-slate-700
                                 transition-all duration-200 border-0 justify-start"
                      onClick={() => handleEditClick(subfolder.id)}
                    >
                      <span className="font-medium">Edit</span>
                    </Button>
                    <Button
                      icon={`${PrimeIcons.TRASH}`}
                      className="flex items-center gap-3 p-3 text-left rounded-lg
                                 bg-transparent hover:bg-red-50 text-red-600
                                 transition-all duration-200 border-0 justify-start"
                      onClick={() => handleDeleteClick(subfolder.id)}
                    >
                      <span className="font-medium">Delete</span>
                    </Button>
                  </div>
                </OverlayPanel>
              </Button>
            </div>
          )}
        </div>

        {/* Middle spacer with floating particles effect - Reduced space */}
        <div className="flex-1 relative min-h-0">
          {isHovered && (
            <div className="absolute inset-0 overflow-hidden">
              <div
                className="absolute top-1/2 left-1/4 w-1 h-1 bg-white/40 rounded-full animate-ping"
                style={{ animationDelay: "0.5s" }}
              />
              <div
                className="absolute top-1/3 right-1/3 w-1 h-1 bg-white/30 rounded-full animate-ping"
                style={{ animationDelay: "1s" }}
              />
              <div
                className="absolute bottom-1/3 left-1/2 w-1 h-1 bg-white/20 rounded-full animate-ping"
                style={{ animationDelay: "1.5s" }}
              />
            </div>
          )}
        </div>

        {/* Bottom section with folder name - Better spacing */}
        <div className="mt-auto space-y-2">
          <h3
            className={`font-semibold text-sm sm:text-base leading-tight line-clamp-2 
                         transition-all duration-300 ${
                           isHovered
                             ? "text-white drop-shadow-sm"
                             : "text-slate-800"
                         }`}
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              wordBreak: "break-word",
              hyphens: "auto",
            }}
          >
            {subfolder.name}
          </h3>

          {/* Animated progress bar */}
          <div
            className={`h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 
                          rounded-full transition-all duration-500 ${
                            isHovered ? "w-full opacity-100" : "w-0 opacity-0"
                          }`}
          />

          {/* Folder type indicator */}
          <div
            className={`flex items-center gap-2 transition-all duration-300 ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="w-1.5 h-1.5 bg-white/60 rounded-full" />
            <span className="text-xs text-white/80 font-medium">Folder</span>
          </div>
        </div>
      </div>

      {/* Hover glow effect */}
      <div
        className={`absolute inset-0 rounded-2xl transition-all duration-300 ${
          isHovered
            ? "bg-gradient-to-t from-black/10 to-transparent"
            : "bg-transparent"
        }`}
      />
    </div>
  );
};

export default ModernSubfolderContainer;
