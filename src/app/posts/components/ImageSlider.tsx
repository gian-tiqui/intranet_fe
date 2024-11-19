import { motion } from "framer-motion";
import { API_BASE } from "@/app/bindings/binding";
import { ImageLocation } from "@/app/types/types";
import Image from "next/image";
import React, { Dispatch, SetStateAction } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import ImageOverlay from "./ImageOverlay";

interface Props {
  imageLocations: ImageLocation[];
  currentIndex: number;
  setCurrentIndex: Dispatch<SetStateAction<number>>;
}

const ImageSlider: React.FC<Props> = ({
  imageLocations,
  currentIndex,
  setCurrentIndex,
}) => {
  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % imageLocations.length);
  };

  const prevSlide = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + imageLocations.length) % imageLocations.length
    );
  };

  return (
    <div>
      <div className="mb-1 relative">
        <ImageOverlay selectedIndex={0} />

        <Image
          src={`${API_BASE}/uploads/${imageLocations[0].imageLocation}`}
          alt="Post image"
          width={1000}
          height={1000}
          className="w-full h-[500px]"
          priority
        />
      </div>
      {imageLocations.length > 1 && (
        <div className="grid grid-cols-2 gap-1">
          <div className="relative">
            <ImageOverlay selectedIndex={1} />
            <Image
              src={`${API_BASE}/uploads/${imageLocations[1].imageLocation}`}
              alt="Post image"
              width={1000}
              height={1000}
              className="w-full h-96"
              priority
            />
          </div>
          <div className="relative">
            <ImageOverlay selectedIndex={2} />

            {imageLocations.length > 3 ? (
              <div className="w-full h-full grid bg-white place-content-center cursor-pointer">
                <p className="text-lg font-bold text-black">
                  +{imageLocations.length - 3}
                </p>
              </div>
            ) : (
              <Image
                src={`${API_BASE}/uploads/${imageLocations[2].imageLocation}`}
                alt="Post image"
                width={1000}
                height={1000}
                className="w-full h-96 object-cover"
                priority
              />
            )}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="relative w-full h-full overflow-hidden">
      <motion.div
        className="flex w-full h-full"
        animate={{
          x: `-${currentIndex * 100}%`,
        }}
        transition={{ type: "spring", stiffness: 60, damping: 20 }}
      >
        {imageLocations.map((imageData) => (
          <div
            key={imageData.id}
            className="w-full h-full flex-shrink-0 bg-neutral-100"
          >
            <Image
              src={`${API_BASE}/uploads/${imageData.imageLocation}`}
              alt="Post image"
              width={1000}
              height={1000}
              className="w-full h-full object-cover"
              priority
            />
          </div>
        ))}
      </motion.div>

      <button
        className="absolute left-0 top-1/2 transform -translate-y-1/2 p-2 z-10"
        onClick={prevSlide}
      >
        <Icon icon={"carbon:next-outline"} className="rotate-180 h-7 w-7" />
      </button>
      <button
        className="absolute right-0 top-1/2 transform -translate-y-1/2 p-2 z-10"
        onClick={nextSlide}
      >
        <Icon icon={"carbon:next-outline"} className="h-7 w-7" />
      </button>

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {imageLocations.map((_, index) => (
          <motion.div
            key={index}
            className={`w-3 h-3 rounded-full ${
              currentIndex === index ? "bg-black" : "bg-gray-400"
            }`}
            initial={{ scale: 0.8 }}
            animate={{ scale: currentIndex === index ? 1 : 0.8 }}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageSlider;
