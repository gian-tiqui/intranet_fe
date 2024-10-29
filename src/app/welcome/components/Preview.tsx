import React from "react";
import postSearching from "../../assets/post searching.png";
import postViewing from "../../assets/post viewing.png";
import reply from "../../assets/reply.png";
import Image from "next/image";

const Preview = () => {
  return (
    <div className="bg-gradient-to-b from-neutral-50 via-neutral-200 to-neutral-300 dark:from-neutral-950 dark:via-neutral-800 dark:to-neutral-700 p-10 flex justify-center">
      <div className="md:w-[50%]">
        <p className="font-semibold text-xl mb-6">Search posts</p>
        <Image
          src={postSearching}
          alt="search"
          width={1000}
          height={1000}
          className="w-full  rounded-lg mb-12"
        />

        <p className="font-semibold text-xl mb-6">View a post</p>
        <Image
          src={postViewing}
          alt="search"
          width={1000}
          height={1000}
          className="w-full  rounded-lg mb-12"
        />

        <p className="font-semibold text-xl mb-6">Send feedbacks to a post</p>
        <Image
          src={reply}
          alt="search"
          width={1000}
          height={1000}
          className="w-full  rounded-lg mb-12"
        />
      </div>
    </div>
  );
};

export default Preview;
