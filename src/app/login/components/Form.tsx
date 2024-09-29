"use client";
import Cookies from "js-cookie";

import useNavbarVisibilityStore from "@/app/store/navbarVisibilityStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Form = () => {
  const { setHidden } = useNavbarVisibilityStore();
  const router = useRouter();

  useEffect(() => {
    if (Cookies.get("intranet") && localStorage.getItem("intranet")) {
      setHidden(false);
      router.push("/");
    }
  }, [setHidden, router]);

  return (
    <div
      className="h-10 w-10 bg-black"
      onClick={() => {
        setHidden(true);
        Cookies.set("intranet", "1");
        localStorage.setItem("intranet", "1");
        router.push("/post");
      }}
    ></div>
  );
};

export default Form;
