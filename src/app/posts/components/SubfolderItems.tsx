import { Folder } from "@/app/types/types";
import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useState } from "react";

interface State {
  subfolder: Folder;
}

const SubfolderItems: React.FC<State> = ({ subfolder }) => {
  const [expand, setExpand] = useState<boolean>(false);

  return (
    <div>
      <div className="flex justify-between">
        <div className="flex gap-2 cursor-pointer items-center">
          <Icon icon={"cuida:folder-outline"} className="h-5 w-5" />
          <p className="text">{subfolder.name}</p>
        </div>

        {subfolder.posts.length > 0 && (
          <Icon
            icon={"bx:down-arrow"}
            className={`h-3 w-3 ${expand && "rotate-180"}`}
            onClick={() => setExpand(!expand)}
          />
        )}
      </div>
      {expand && (
        <div className="flex flex-col gap-1 ms-2 pt-2">
          {subfolder.posts.map((post) => (
            <div key={post.pid}>
              <div className="flex gap-1 items-center">
                <Icon icon={"mynaui:file"} className="h-5 w-5" />
                <p>{post.title ? post.title : "Untitled"}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SubfolderItems;
