import { Icon } from "@iconify/react/dist/iconify.js";
import Image from "next/image";
import { format } from "date-fns";
import React, { Dispatch, SetStateAction } from "react";

interface Props {
  title: string | undefined;
  message: string | undefined;
  filePreviews: string[];
  setShowPreview: Dispatch<SetStateAction<boolean>>;
}

const PostPreview: React.FC<Props> = ({
  filePreviews,
  title,
  message,
  setShowPreview,
}) => {
  const closePreview = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowPreview(false);
  };
  return (
    <div
      className="absolute w-full grid place-content-center h-full bg-black/90 z-50"
      onClick={closePreview}
    >
      <div className="bg-neutral-200 dark:bg-neutral-800 px-5">
        <div className="flex items-start gap-2 mb-4 justify-between pt-4">
          <div className="flex gap-3 items-start">
            <div className="h-9 w-9 bg-gray-300 rounded-full"></div>
            <h1 className="font-semibold">You</h1>
          </div>
          <div className="rounded">
            <div className="hover:bg-gray-300 hover:dark:bg-neutral-700 p-1 mb-1">
              <Icon icon={"iwwa:option-horizontal"} className="h-5 w-5" />
            </div>
          </div>
        </div>

        <div className="w-full flex justify-between">
          <div>
            <h1 className="text-lg font-bold">{title}</h1>
            <h4 className="text-[10px] mb-3">
              {format(new Date(), "MMMM dd, yyyy")}
            </h4>
          </div>
        </div>

        <hr className="w-full border-t border-gray-300 dark:border-gray-700 mb-2" />

        <div
          className="text-md mb-2 max-w-full whitespace-pre-wrap break-words"
          style={{
            overflowWrap: "break-word",
            wordWrap: "break-word",
            hyphens: "auto",
          }}
        >
          {message}
        </div>
        {filePreviews &&
          filePreviews.length > 0 &&
          filePreviews
            .slice(0, 1)
            .map((filePreview, index) => (
              <Image
                src={filePreview}
                alt={filePreview}
                height={1000}
                width={1000}
                className="h-96 w-96"
                key={index}
              />
            ))}
        <div
          className={`flex items-center w-full justify-between gap-1 rounded-lg py-2 px-1 mb-2`}
        >
          <div className="flex hover:bg-gray-300 dark:hover:bg-neutral-700 py-1 items-center gap-1 rounded  cursor-pointer ">
            <Icon icon={"akar-icons:download"} />
            <span className="text-xs">Download Image as PDF</span>
          </div>
          <div
            className={`hover:bg-gray-300 dark:hover:bg-neutral-700 py-1 rounded flex items-center gap-1 cursor-pointer `}
          >
            <>
              <Icon
                icon={"material-symbols-light:mark-email-read-outline"}
                className="h-5 w-5"
              />
              <p className="text-xs">Read</p>
            </>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostPreview;
