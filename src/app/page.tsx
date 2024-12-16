import React from "react";
import AuthListener from "./components/AuthListener";
import Grid from "./components/Grid";

const Home = () => {
  return (
    <div>
      <AuthListener />

      <Grid />
    </div>
  );
};

export default Home;
