import React from "react";
import Form from "./components/Form";
import LoginTemplate from "./template/LoginTemplate";
import Appbar from "./components/Appbar";
import { AnimatePresence } from "framer-motion";
import MotionTemplate from "../components/animation/MotionTemplate";
import ChangingContainer from "./components/ChangingContainer";
import Footer from "./components/Footer";

const Login = () => {
  return (
    <div className="">
      <LoginTemplate>
        <AnimatePresence>
          <Appbar />
          <MotionTemplate>
            <div className="grid w-full md:grid-cols-2">
              <div className="grid place-content-center">
                <ChangingContainer />
              </div>
              <div className="grid place-content-center">
                <Form />
              </div>
            </div>
          </MotionTemplate>
        </AnimatePresence>
        <Footer />
      </LoginTemplate>
    </div>
  );
};

export default Login;
