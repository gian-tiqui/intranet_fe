import { API_BASE } from "@/app/bindings/binding";
import { ImageLocation } from "@/app/types/types";
import React, { Dispatch, SetStateAction, useState } from "react";
import ImageOverlay from "./ImageOverlay";
import { Dialog } from "primereact/dialog";
import { Image as PrimeImage } from "primereact/image";
import Image from "next/image";

interface Props {
  imageLocations: ImageLocation[];
  currentIndex: number;
  postName: string | undefined;
  setCurrentIndex: Dispatch<SetStateAction<number>>;
}

const ImageSlider: React.FC<Props> = ({ imageLocations, postName }) => {
  const [visible, setVisible] = useState<boolean>(false);

  return (
    <div>
      <div className="mb-1">
        <div className="relative">
          <Dialog
            visible={visible}
            className="w-[95%] h-[90vh]"
            pt={{
              header: {
                className:
                  "bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100",
              },
              content: {
                className:
                  "bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100",
              },
            }}
            header={`${postName} images`}
            onHide={() => {
              if (visible) setVisible(false);
            }}
          >
            <div className="grid grid-cols-2 gap-2 ">
              {imageLocations.map((imageLocation) => (
                <PrimeImage
                  key={imageLocation.id}
                  src={`${API_BASE}/uploads/${imageLocation.imageLocation}`}
                  preview
                  width="3000"
                />
              ))}
            </div>
          </Dialog>
          {imageLocations.length > 1 && (
            <ImageOverlay setVisible={setVisible} />
          )}

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
            <ImageOverlay setVisible={setVisible} />
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
              <ImageOverlay setVisible={setVisible} />

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
