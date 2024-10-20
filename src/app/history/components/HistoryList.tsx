import { Post } from "@/app/types/types";
import React from "react";
import HistoryItem from "./HistoryItem";

interface Props {
  history: Post[];
}

const HistoryList: React.FC<Props> = ({ history }) => {
  return (
    <div className="flex flex-col w-full gap-1">
      {history.map((post) => (
        <HistoryItem key={post.pid} post={post} />
      ))}
    </div>
  );
};

export default HistoryList;
