import useShowImageStore from "@/app/store/imageViewStore";
import React from "react";

interface Props {
  selectedIndex: number;
}

const ImageOverlay: React.FC<Props> = ({ selectedIndex }) => {
  const { setShowImage } = useShowImageStore();
  const handleClick = () => {
    setShowImage({ show: true, selectedIndex });
  };

  return (
    <div
      onClick={handleClick}
      className="absolute w-full h-full bg-none hover:bg-black/20 cursor-pointer"
    ></div>
  );
};

export default ImageOverlay;
