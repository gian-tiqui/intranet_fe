import React from "react";
import tempImg from "../../assets/Hospital Facade Edited 2.png";
import Image from "next/image";

const Preview = () => {
  return (
    <div className="bg-gradient-to-b from-neutral-50 via-neutral-200 to-neutral-300 p-10 flex justify-center">
      <div className="w-[50%]">
        <p className="font-semibold text-xl mb-6">Search posts</p>
        <Image
          src={tempImg}
          alt="search"
          width={1000}
          height={1000}
          className="w-full h-96 rounded-lg mb-12"
        />

        <p className="font-semibold text-xl mb-6">View a post</p>
        <Image
          src={tempImg}
          alt="search"
          width={1000}
          height={1000}
          className="w-full h-96 rounded-lg mb-12"
        />

        <p className="font-semibold text-xl mb-6">Send feedbacks to a post</p>
        <Image
          src={tempImg}
          alt="search"
          width={1000}
          height={1000}
          className="w-full h-96 rounded-lg mb-12"
        />
      </div>
    </div>
  );
};

export default Preview;
