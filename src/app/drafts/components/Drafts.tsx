"use client";
import FolderDraft from "@/app/components/FolderDraft";
import PostDraft from "@/app/components/PostDraft";
import { decodeUserData } from "@/app/functions/functions";
import { Folder, Post, Query } from "@/app/types/types";
import { getDraftsByUserId } from "@/app/utils/service/userService";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";

const Drafts = () => {
  const [userId, setUserID] = useState<number>(-1);
  const [query] = useState<Query>({ search: "", skip: 0, take: 10 });

  const { data } = useQuery({
    queryKey: [`user-${userId}-drafts-${JSON.stringify(query)}`],
    queryFn: () => getDraftsByUserId(userId, query),
    enabled: !!userId && userId !== -1,
  });

  useEffect(() => {
    const extractUser = async () => {
      const id = decodeUserData()?.sub;

      if (id) setUserID(id);
    };

    extractUser();
  }, []);

  useEffect(() => {
    console.log(data?.data);
  }, [data]);

  return (
    <div className="w-full h-[86vh] overflow-y-auto pt-4">
      <h4 className="font-medium text-blue-600 text-lg mb-6">Drafts</h4>
      <div className="flex flex-col gap-2">
        {data?.data.results.map(
          (data: { type: string; data: Post | Folder }) => {
            switch (data.type) {
              case "folder":
                const folder = data.data as Folder;

                return (
                  <FolderDraft key={`folder-${folder.id}`} folder={folder} />
                );
              case "post":
                const post = data.data as Post;

                return <PostDraft key={`post-${post.pid}`} post={post} />;
              default:
                return <p>This is an outlier</p>;
            }
          }
        )}
      </div>
    </div>
  );
};

export default Drafts;
