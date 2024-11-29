import React, { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { GroupedPosts, Post } from "@/app/types/types";
import MotionTemplate from "@/app/components/animation/MotionTemplate";
import HoverBox from "@/app/components/HoverBox";
import PostListSkeleton from "./PostListSkeleton";
import NoPosts from "./NoPosts";
import useToggleStore from "@/app/store/navbarCollapsedStore";
import { useQuery } from "@tanstack/react-query";
import {
  fetchPostDeptIds,
  fetchPosts,
  fetchPublicPosts,
} from "@/app/functions/functions";
import usePostIdStore from "@/app/store/postId";
import { Icon } from "@iconify/react/dist/iconify.js";
import PostListItem from "./PostListItem";
import useDepartments from "@/app/custom-hooks/departments";
import useSignalStore from "@/app/store/signalStore";

const groupPostsByDate = (posts: Post[]) => {
  return posts.reduce((groups: GroupedPosts, post: Post) => {
    const date = format(new Date(post.createdAt), "yyyy-MM-dd");
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(post);
    return groups;
  }, {});
};

interface Props {
  selectedVis: string;
  isMobile: boolean;
  onClick: (dest: string) => void;
}

const Skeleton = () => {
  return Array(3)
    .fill(0)
    .map((_, index) => (
      <div key={index} className="px-4 grid gap-2 mb-6">
        <div className="w-1/3 animate-pulse h-4 bg-gray-300 rounded"></div>
        <div className="w-full animate-pulse h-4 bg-gray-300 rounded"></div>
        <div className="w-full animate-pulse h-4 bg-gray-300 rounded"></div>
        <div className="w-full animate-pulse h-4 bg-gray-300 rounded"></div>
      </div>
    ));
};

const PostList: React.FC<Props> = ({ selectedVis, isMobile, onClick }) => {
  const { signal, setSignal } = useSignalStore();

  const {
    data: _posts,
    isLoading,
    refetch: refetchPrivate,
  } = useQuery({
    queryKey: ["private_posts"],
    queryFn: fetchPosts,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  const { data: _allPosts, refetch: refetchPublic } = useQuery({
    queryKey: ["public_posts"],
    queryFn: fetchPublicPosts,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  const [posts, setPosts] = useState<Post[]>([]);
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const { postId } = usePostIdStore();
  const [selectedDeptId, setSelectedDeptId] = useState<number>(-1);
  const departments = useDepartments();

  const handleDeptClicked = async (deptId: number) => {
    if (selectedVis !== "all") return;

    setSelectedDeptId(deptId);

    if (deptId === -1) {
      setPosts(_posts?.posts || []);
    } else {
      const filteredPosts = await Promise.all(
        (_allPosts?.posts || []).map(async (post) => {
          const deptIds = await fetchPostDeptIds(post.pid);
          return deptIds.includes(String(deptId)) ? post : null;
        })
      );
      setAllPosts(filteredPosts.filter((post) => post !== null));
    }
  };

  useEffect(() => {
    if (_posts) setPosts(_posts.posts);
  }, [_posts]);

  useEffect(() => {
    if (_allPosts) setAllPosts(_allPosts.posts);
  }, [_allPosts]);

  const { isCollapsed, setIsCollapsed } = useToggleStore();

  const groupedPosts = useMemo(
    () => groupPostsByDate(selectedVis === "dept" ? posts : allPosts),
    [selectedVis, posts, allPosts]
  );

  useEffect(() => {
    refetchPrivate();
    refetchPublic();

    if (!_posts || !_allPosts) return;

    setPosts(_posts?.posts);
    setAllPosts(_allPosts.posts);

    setSignal(false);
  }, [refetchPrivate, refetchPublic, _allPosts, _posts, signal, setSignal]);

  const [maxNum, setMaxNum] = useState<number>(2);

  if (selectedVis == "qm") {
    return (
      <div className="grid place-content-center mt-8">
        <div className="flex flex-col items-center gap-4">
          <Icon icon={"emojione-monotone:stop-sign"} className="h-7 w-7" />
          <p className="font-semibold">Underdevelopment</p>
        </div>
      </div>
    );
  }

  const showMore = () => {
    setMaxNum((prevMax) => prevMax + 3);
  };

  if (isLoading) {
    return <Skeleton />;
  }

  if (!posts) {
    return <PostListSkeleton />;
  }

  if (posts.length === 0 && allPosts?.length === 0) {
    return <NoPosts />;
  }

  const handleItemClicked = (pid: number) => {
    if (isMobile) setIsCollapsed(!isCollapsed);
    if (pid === postId) return;
    onClick(`/posts/${pid}`);
  };

  return (
    <>
      <div>
        {" "}
        {selectedVis === "all" && (
          <div className="w-full flex gap-2 flex-wrap px-5 mb-5">
            <div
              onClick={() => handleDeptClicked(-1)}
              className={`text-xs border dark:border-neutral-700 rounded ${
                selectedDeptId === -1 ? "bg-gray-200 dark:bg-neutral-700" : ""
              } grid place-content-center px-3 py-1 font-semibold cursor-pointer hover:bg-gray-200 dark:hover:bg-neutral-700`}
              key={-1}
            >
              All
            </div>
            {departments
              .filter((dept) => dept.posts.length > 0)
              .map((dept) => (
                <div
                  onClick={() => handleDeptClicked(dept.deptId)}
                  className={`text-xs border dark:border-neutral-700 rounded ${
                    selectedDeptId === dept.deptId
                      ? "bg-gray-200 dark:bg-neutral-700"
                      : ""
                  } grid place-content-center px-3 py-1 font-semibold cursor-pointer hover:bg-gray-200 dark:hover:bg-neutral-700`}
                  key={dept.deptId}
                >
                  {dept.departmentCode}
                </div>
              ))}
          </div>
        )}
        {Object.keys(groupedPosts)
          .slice(0, maxNum)
          .map((date) => (
            <MotionTemplate key={date}>
              <div className="px-3 mb-8">
                <div key={date}>
                  <h2 className="text-xs font-semibold ms-2 mb-2">
                    {format(new Date(date), "MMMM dd, yyyy")}
                  </h2>
                  <div className="flex flex-col">
                    {groupedPosts[date].map((post, index) => (
                      <div
                        key={index}
                        onClick={() => handleItemClicked(post.pid)}
                      >
                        <PostListItem post={post} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </MotionTemplate>
          ))}
      </div>

      {Object.keys(groupedPosts).length > 2 && (
        <HoverBox className="hover:bg-neutral-200 dark:hover:bg-neutral-800 py-1 px-2 mx-4 cursor-pointer rounded">
          <button
            onClick={showMore}
            className="w-full flex items-center justify-center gap-1"
          >
            <Icon icon={"prime:expand"} className="h-5 w-5" />
            Show more
          </button>
        </HoverBox>
      )}
    </>
  );
};

export default PostList;
