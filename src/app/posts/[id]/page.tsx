import Comments from "../components/Comments";
import CommentBar from "../components/CommentBar";
import AuthListener from "@/app/components/AuthListener";
import PostContainer from "../components/PostContainer";

const PostPage = ({ params }: { params: { id: number } }) => {
  const { id } = params;
  return (
    <div className="">
      <AuthListener />
      <PostContainer id={id} />
      <hr className="w-full border-t border-gray-300 dark:border-gray-700 mb-6" />
      <Comments />
      <CommentBar />
    </div>
  );
};

export default PostPage;
