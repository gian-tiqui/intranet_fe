"use client";
import { useEffect } from "react";
import Cookies from "js-cookie";
import { usePathname, useRouter } from "next/navigation";
import useNavbarVisibilityStore from "../store/navbarVisibilityStore";

const AuthListener = () => {
  const { setHidden } = useNavbarVisibilityStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = () => {
      if (!localStorage.getItem("intranet") && !Cookies.get("intranet")) {
        setHidden(false);
        router.push("/login");
      } else {
        setHidden(true);
      }
    };

    checkAuth();
  }, [pathname, router, setHidden]);

  return <div></div>;
};

export default AuthListener;
