import { Image } from "primereact/image";
import React from "react";

interface Props {
  filePreviews: string[];
  currentPage: number;
}

const ImagePaginator: React.FC<Props> = ({ filePreviews, currentPage }) => {
  return (
    <main>
      <Image
        pt={{
          rotateLeftButton: { className: "text-white" },
          rotateRightButton: { className: "text-white" },
          zoomInButton: { className: "text-white" },
          zoomOutButton: { className: "text-white" },
          closeButton: { className: "text-white" },
        }}
        src={filePreviews[currentPage]}
        alt={`${filePreviews}-${currentPage}`}
        className="mb-10"
        preview
      />
    </main>
  );
};

export default ImagePaginator;
