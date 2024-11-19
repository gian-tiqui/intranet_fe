import React from "react";
import useImagesStore from "../store/imagesStore";
import Image from "next/image";
import useShowImageStore from "../store/imageViewStore";
import { API_BASE } from "../bindings/binding";

interface Props {
  mSetShowImage: (showImage: { show: boolean; selectedIndex: number }) => void;
}

const ImagePreview: React.FC<Props> = ({ mSetShowImage }) => {
  const { showImage, setShowImage } = useShowImageStore();
  const { images } = useImagesStore();

  const handleNextClicked = () => {
    if (showImage.selectedIndex < images.length - 1) {
      setShowImage({ show: true, selectedIndex: showImage.selectedIndex + 1 });
    }
  };

  const handlePrevClicked = () => {
    if (showImage.selectedIndex > 0) {
      setShowImage({ show: true, selectedIndex: showImage.selectedIndex - 1 });
    }
  };

  return (
    <div
      className="absolute h-full w-full bg-black/60 z-50 grid place-content-center"
      onClick={() => mSetShowImage({ show: false, selectedIndex: -1 })}
    >
      <div
        className="h-full w-full bg-neutral-200 dark:bg-neutral-900"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={`${API_BASE}/uploads/${images[showImage.selectedIndex]}`}
          alt={images[showImage.selectedIndex]}
          height={1000}
          width={1000}
          className="h-96 w-96"
        />
        <div>
          <button onClick={handleNextClicked}>next</button>
          <button onClick={handlePrevClicked}>prev</button>
        </div>
      </div>
    </div>
  );
};

export default ImagePreview;
