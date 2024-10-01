import React from "react";
import AuthListener from "./components/AuthListener";
import Grid from "./posts/components/Grid";
import MotionTemplate from "./components/animation/MotionTemplate";

const Home = () => {
  return (
    <>
      <AuthListener />
      <MotionTemplate>
        <Grid />
      </MotionTemplate>
    </>
  );
};

export default Home;
