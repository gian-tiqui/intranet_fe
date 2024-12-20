import { API_BASE } from "@/app/bindings/binding";
import { ImageLocation } from "@/app/types/types";
import Image from "next/image";
import React, { Dispatch, SetStateAction } from "react";
import ImageOverlay from "./ImageOverlay";

interface Props {
  imageLocations: ImageLocation[];
  currentIndex: number;
  setCurrentIndex: Dispatch<SetStateAction<number>>;
}

const ImageSlider: React.FC<Props> = ({ imageLocations }) => {
  return (
    <div>
      <div className="mb-1">
        <div className="relative">
          <ImageOverlay selectedIndex={0} />

          <Image
            src={`${API_BASE}/uploads/${imageLocations[0].imageLocation}`}
            alt="Post image"
            width={1000}
            height={1000}
            className="w-full h-auto"
            priority
          />
        </div>
      </div>
      {imageLocations.length > 1 && (
        <div
          className={`grid ${
            imageLocations.length < 3 ? "grid-cols-1" : "grid-cols-2"
          } gap-1`}
        >
          <div className="relative">
            <ImageOverlay selectedIndex={1} />
            <Image
              src={`${API_BASE}/uploads/${imageLocations[1].imageLocation}`}
              alt="Post image"
              width={1000}
              height={1000}
              className="w-full aspect-auto"
              priority
            />
          </div>
          {imageLocations.length > 2 && (
            <div className="relative">
              <ImageOverlay selectedIndex={2} />

              {imageLocations.length > 3 ? (
                <div className="w-full h-full grid bg-neutral-800 place-content-center cursor-pointer">
                  <p className="text-lg font-bold text-white">
                    +{imageLocations.length - 3}
                  </p>
                </div>
              ) : (
                <Image
                  src={`${API_BASE}/uploads/${imageLocations[2].imageLocation}`}
                  alt="Post image"
                  width={1000}
                  height={1000}
                  className="w-full aspect-auto"
                  priority
                />
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageSlider;
