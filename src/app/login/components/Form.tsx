"use client";
import Cookies from "js-cookie";

import useNavbarVisibilityStore from "@/app/store/navbarVisibilityStore";
import { redirect } from "next/navigation";
import { useEffect } from "react";

const Form = () => {
  const { setHidden } = useNavbarVisibilityStore();

  useEffect(() => {
    if (Cookies.get("intranet") && localStorage.getItem("intranet")) {
      setHidden(false);
      redirect("/");
    }
  }, [setHidden]);

  return (
    <div
      className="h-10 w-10 bg-black"
      onClick={() => {
        setHidden(true);
        Cookies.set("intranet", "1");
        localStorage.setItem("intranet", "1");
        redirect("post/1");
      }}
    ></div>
  );
};

export default Form;
