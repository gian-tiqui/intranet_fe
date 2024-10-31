"use client";
import { useEffect } from "react";
import Cookies from "js-cookie";
import { usePathname, useRouter } from "next/navigation";
import useNavbarVisibilityStore from "../store/navbarVisibilityStore";
import { INTRANET } from "../bindings/binding";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  exp: number;
}

/*
 *  This component will be used to check if the user on the initial load is logged in
 *  by checking their refresh and access tokens which are stored in the browser's
 *  cookies and local storage.
 */

const AuthListener = () => {
  const { setHidden } = useNavbarVisibilityStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = () => {
      const accessToken = localStorage.getItem(INTRANET);
      const refreshToken = Cookies.get(INTRANET);

      if (!accessToken && !refreshToken) {
        setHidden(false);
        router.push("/welcome");
      } else {
        if (refreshToken) {
          const decoded: DecodedToken = jwtDecode(refreshToken);
          const currentTime = Math.floor(Date.now() / 1000);

          if (decoded.exp < currentTime) {
            setHidden(false);
            router.push("/welcome");
          } else {
            setHidden(true);
          }
        } else {
          setHidden(true);
        }
      }
    };

    checkAuth();
  }, [pathname, router, setHidden]);

  return <></>;
};

export default AuthListener;
