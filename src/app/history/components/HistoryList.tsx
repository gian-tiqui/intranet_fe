import { Post } from "@/app/types/types";
import React from "react";
import HistoryItem from "./HistoryItem";

interface Props {
  history: { post: Post }[];
}

const HistoryList: React.FC<Props> = ({ history }) => {
  return (
    <div className="flex flex-col w-full gap-1">
      {history.map((post, index) => (
        <HistoryItem key={index} post={post} />
      ))}
    </div>
  );
};

export default HistoryList;
