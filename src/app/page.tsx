import React from "react";
import AuthListener from "./components/AuthListener";
import Grid from "./posts/components/Grid";

const Home = () => {
  return (
    <>
      <AuthListener />
      <Grid />
    </>
  );
};

export default Home;
