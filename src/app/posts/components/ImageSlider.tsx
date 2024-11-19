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
            className="w-full h-[500px]"
            priority
          />
        </div>
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
                className="w-full h-96 object-cover"
                priority
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageSlider;
