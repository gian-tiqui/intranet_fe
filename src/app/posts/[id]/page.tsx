import AuthListener from "@/app/components/AuthListener";
import PostContainer from "../components/PostContainer";
import { use } from "react";

const PostPage = ({ params }: { params: Promise<{ id: string }> }) => {
  const param = use(params);

  return (
    <div className="">
      <AuthListener />
      <PostContainer id={+param.id} type="single-single-post" />
    </div>
  );
};

export default PostPage;
