import React from "react";
import Form from "./components/Form";
import LoginTemplate from "./template/LoginTemplate";
import Appbar from "./components/Appbar";
import { AnimatePresence } from "framer-motion";
import MotionTemplate from "../components/animation/MotionTemplate";

const Login = () => {
  return (
    <div className="">
      <LoginTemplate>
        <AnimatePresence>
          <Appbar />
          <MotionTemplate>
            <div className="grid w-full md:grid-cols-2">
              <div className="grid place-content-center">meow</div>
              <div className="grid place-content-center">
                <Form />
              </div>
            </div>
          </MotionTemplate>
        </AnimatePresence>
      </LoginTemplate>
    </div>
  );
};

export default Login;
