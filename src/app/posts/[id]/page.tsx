import AuthListener from "@/app/components/AuthListener";
import PostContainer from "../components/PostContainer";

const PostPage = ({ params }: { params: { id: number } }) => {
  const { id } = params;

  return (
    <div className="">
      <AuthListener />
      <PostContainer id={id} />
    </div>
  );
};

export default PostPage;
