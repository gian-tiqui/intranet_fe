import React from "react";
import Form from "./components/Form";
import LoginTemplate from "./template/LoginTemplate";
import Appbar from "./components/Appbar";
import { AnimatePresence } from "framer-motion";
import ChangingContainer from "./components/ChangingContainer";
import Footer from "./components/Footer";
import SpinningLogo from "./components/SpinningLogo";

const Login = () => {
  return (
    <div className="relative">
      <LoginTemplate>
        <AnimatePresence>
          <SpinningLogo />
          <Appbar key={"app-bar"} />
          <div
            className="grid w-full pt-28 md:pt-0 md:grid-cols-2 h-screen"
            key={"login-grid"}
          >
            <div className="grid place-content-center">
              <ChangingContainer />
            </div>
            <div className="grid place-content-center">
              <Form />
            </div>
          </div>
          <Footer key={"footer"} />
        </AnimatePresence>
      </LoginTemplate>
    </div>
  );
};

export default Login;
