import React, { Dispatch, SetStateAction } from "react";

interface Props {
  setVisible: Dispatch<SetStateAction<boolean>>;
}

const ImageOverlay: React.FC<Props> = ({ setVisible }) => {
  const handleClick = () => {
    setVisible(true);
  };

  return (
    <div
      onClick={handleClick}
      className="absolute w-full h-full bg-none hover:bg-black/20 cursor-pointer"
    ></div>
  );
};

export default ImageOverlay;
