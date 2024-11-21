import React from "react";
import useImagesStore from "../store/imagesStore";
import Cimage from "next/image";
import useShowImageStore from "../store/imageViewStore";
import { API_BASE } from "../bindings/binding";
import jsPDF from "jspdf";
import { Icon } from "@iconify/react/dist/iconify.js";

interface Props {
  mSetShowImage: (showImage: { show: boolean; selectedIndex: number }) => void;
}

const ImagePreview: React.FC<Props> = ({ mSetShowImage }) => {
  const { showImage, setShowImage } = useShowImageStore();
  const { images } = useImagesStore();

  const handleDownloadImage = async () => {
    if (!images || !images[showImage.selectedIndex]) return;

    try {
      const imageLocation = images[showImage.selectedIndex];

      const response = await fetch(`${API_BASE}/uploads/${imageLocation}`);
      if (!response.ok) {
        console.error("Failed to fetch image:", response.statusText);
        return;
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      const img = new window.Image();
      img.src = url;

      img.onload = () => {
        const pdf = new jsPDF();

        const imgWidth = 180;
        const imgHeight = (img.height * imgWidth) / img.width;

        pdf.addImage(img, "JPEG", 10, 10, imgWidth, imgHeight);
        pdf.save(`post-image-${imageLocation}.pdf`);

        URL.revokeObjectURL(url);
      };

      img.onerror = (error) => {
        console.error("Error loading image:", error);
        URL.revokeObjectURL(url);
      };
    } catch (error) {
      console.error("Error in downloading image:", error);
    }
  };

  const handleNextClicked = () => {
    if (showImage.selectedIndex < images.length - 1) {
      setShowImage({ show: true, selectedIndex: showImage.selectedIndex + 1 });
    } else {
      setShowImage({ show: true, selectedIndex: 0 });
    }
  };

  const handlePrevClicked = () => {
    if (showImage.selectedIndex > 0) {
      setShowImage({ show: true, selectedIndex: showImage.selectedIndex - 1 });
    } else {
      setShowImage({ selectedIndex: images.length - 1, show: true });
    }
  };

  return (
    <div
      className="absolute inset-0 bg-black/60 z-50 flex justify-center items-center"
      onClick={() => mSetShowImage({ show: false, selectedIndex: -1 })}
    >
      <div
        className="relative bg-neutral-200 dark:bg-neutral-900 rounded-lg max-w-[95%] max-h-[90%] p-4 flex flex-col items-center overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <h1 className="font-bold text-lg absolute text-black bottom-6 left-7">
          Page {showImage.selectedIndex + 1}
        </h1>
        {/* Download Icon */}
        <div
          className="p-1 bg-neutral-900 hover:bg-neutral-700 rounded-full absolute top-7 right-11 cursor-pointer"
          onClick={handleDownloadImage}
        >
          <Icon
            icon={"material-symbols:download"}
            className="h-6 w-6 text-white"
          />
        </div>

        {/* Image Container */}
        <div className="overflow-auto w-full h-full flex justify-center items-center">
          <Cimage
            src={`${API_BASE}/uploads/${images[showImage.selectedIndex]}`}
            alt={images[showImage.selectedIndex]}
            height={1000}
            width={1000}
            className="object-contain md:w-[500px] md:h-[100%]"
          />
        </div>

        {/* Navigation Buttons */}
        <Icon
          icon={"carbon:next-outline"}
          className="text-black rounded text-sm absolute h-10 w-10 rotate-180 left-4 top-1/2 transform -translate-y-1/2"
          onClick={handlePrevClicked}
        />

        <Icon
          icon={"carbon:next-outline"}
          className="text-black rounded text-sm absolute h-10 w-10 right-10 top-1/2 transform -translate-y-1/2"
          onClick={handleNextClicked}
        />
      </div>
    </div>
  );
};

export default ImagePreview;
