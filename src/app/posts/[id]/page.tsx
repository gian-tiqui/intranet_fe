import AuthListener from "@/app/components/AuthListener";
import PostContainer from "../components/PostContainer";
import { use } from "react";

type Param = Promise<{ id: number }>;

const PostPage = (props: Param) => {
  const param = use(props);

  return (
    <div className="">
      <AuthListener />
      <PostContainer id={param.id} type="single-single-post" />
    </div>
  );
};

export default PostPage;
