import { QmTypeItem } from "@/app/types/types";
import React from "react";

interface Props {
  item: QmTypeItem;
}

const FolderItem: React.FC<Props> = ({ item }) => {
  return <div>{JSON.stringify(item)}</div>;
};

export default FolderItem;