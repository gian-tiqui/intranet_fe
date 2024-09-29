"use client";
import { useEffect } from "react";
import Cookies from "js-cookie";
import { usePathname, useRouter } from "next/navigation";
import useNavbarVisibilityStore from "../store/navbarVisibilityStore";
import { INTRANET } from "../page";

const AuthListener = () => {
  const { setHidden } = useNavbarVisibilityStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = () => {
      if (!localStorage.getItem(INTRANET) && !Cookies.get(INTRANET)) {
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
