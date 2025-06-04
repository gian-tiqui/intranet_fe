import React from "react";
import AuthListener from "./components/AuthListener";
import Grid from "./components/Grid";

const Home = () => {
  return (
    <div className="mx-auto w-[80%]">
      <AuthListener />
      <Grid />
    </div>
  );
};

export default Home;
