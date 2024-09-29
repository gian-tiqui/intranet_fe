import React from "react";
import AuthListener from "./components/AuthListener";

export const INTRANET = "intranet";

const Home = () => {
  return (
    <div>
      <AuthListener />
    </div>
  );
};

export default Home;
