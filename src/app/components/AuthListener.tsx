"use client";
import { useEffect } from "react";
import Cookies from "js-cookie";
import { usePathname, useRouter } from "next/navigation";
import useNavbarVisibilityStore from "../store/navbarVisibilityStore";
import { INTRANET } from "../bindings/binding";

/*
 *  This component will be used to check if the user on the initial load is logged in
 *  by checking there refresh and access tokens which are stored in the brower's
 *  cookies and local storage.
 */

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

  return <></>;
};

export default AuthListener;
