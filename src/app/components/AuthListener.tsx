"use client";
import { redirect } from "next/navigation";
import React, { useEffect } from "react";
import Cookies from "js-cookie";
import useNavbarVisibilityStore from "../store/navbarVisibilityStore";

const AuthListener = () => {
  const { setHidden } = useNavbarVisibilityStore();
  useEffect(() => {
    if (!localStorage.getItem("intranet") && !Cookies.get("intranet")) {
      setHidden(true);
      redirect("/login");
    }
  }, [setHidden]);
  return <div></div>;
};

export default AuthListener;
