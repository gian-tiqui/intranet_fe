import React from "react";
import GeneralBulletin from "./components/GeneralBulletin";
import AuthListener from "../components/AuthListener";

const Bulletin = () => {
  return (
    <div>
      <AuthListener />
      <GeneralBulletin />
    </div>
  );
};

export default Bulletin;
