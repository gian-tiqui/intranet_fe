import Image from "next/image";
import Comments from "../components/Comments";
import CommentBar from "../components/CommentBar";

const PostPage = ({ params }: { params: { id: number } }) => {
  const { id } = params;
  return (
    <div className="">
      <h1 className="text-xl font-bold">Memo Title {id}</h1>
      <h4 className="text-sm mb-2">Posted By: Someone</h4>
      <Image
        className="h-96 w-full bg-neutral-100 mb-"
        src="https://nextjs.org/icons/next.svg"
        alt="Next.js logo"
        height={0}
        width={0}
        priority
      />
      <div className="h-10 flex flex-grow w-full mb-3">
        <div className="w-full">
          <p className="cursor-pointer">Like</p>
        </div>
        <div className="w-full">
          <p className="text-center cursor-pointer">Comment</p>
        </div>
        <div className="w-full">
          <p className="text-end cursor-pointer">Share</p>
        </div>
      </div>
      <Comments />
      <CommentBar />
    </div>
  );
};

export default PostPage;
