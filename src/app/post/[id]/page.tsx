const PostPage = ({ params }: { params: { id: number } }) => {
  const { id } = params;
  return (
    <div className="">
      <h1>Post ID: {id}</h1>
      {Array(10)
        .fill(0)
        .map((_, index) => (
          <p key={index} className="h-96 h-50"></p>
        ))}
    </div>
  );
};

export default PostPage;
