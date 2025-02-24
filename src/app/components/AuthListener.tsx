"use client";
import { useEffect } from "react";
import Cookies from "js-cookie";
import { usePathname, useRouter } from "next/navigation";
import useNavbarVisibilityStore from "../store/navbarVisibilityStore";
import {
  API_BASE,
  INTRANET,
  PROJECT_VERSION,
  PROJECT_VERSION_KEY,
} from "../bindings/binding";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import { toastClass } from "../tailwind-classes/tw_classes";
import apiClient from "../http-common/apiUrl";
import useUpdateDialogStore from "../store/updateDialogStore";

/*
 *  This component will be used to check if the user on the initial load is logged in
 *  by checking their refresh and access tokens which are stored in the browser's
 *  cookies and local storage.
 */

const AuthListener = () => {
  const { setHidden } = useNavbarVisibilityStore();
  const router = useRouter();
  const pathname = usePathname();
  const { setUpdateDialogShown } = useUpdateDialogStore();

  useEffect(() => {
    const checkAuth = async () => {
      if (!INTRANET || !PROJECT_VERSION || !PROJECT_VERSION_KEY) return;

      const accessToken = localStorage.getItem(INTRANET);
      const refreshToken = Cookies.get(INTRANET);

      const projectVersionKey = PROJECT_VERSION_KEY;
      const projectVersion = PROJECT_VERSION;
      const currProjectVersion = localStorage.getItem(PROJECT_VERSION_KEY);

      // No version set in local storage this will trigger for the logged in people before the employee id is stringified
      // Will only happen on V1.0A
      if (!currProjectVersion) {
        localStorage.removeItem(INTRANET);
        Cookies.remove(INTRANET);
        localStorage.setItem(
          projectVersionKey,
          JSON.stringify({ epv: projectVersion })
        );
        setHidden(false);
        router.push("/welcome");
        setUpdateDialogShown(true);
        return;
      }

      // Version is outdated
      const currVersion = JSON.parse(currProjectVersion).epv;

      if (currVersion !== projectVersion && accessToken) {
        localStorage.removeItem(INTRANET);
        Cookies.remove(INTRANET);
        localStorage.setItem(
          projectVersionKey,
          JSON.stringify({ epv: projectVersion })
        );
        const decoded: { sub: number } = jwtDecode(accessToken);

        apiClient
          .post(`${API_BASE}/auth/logout`, {
            userId: decoded.sub,
          })
          .then(() => {
            setHidden(false);
            if (!INTRANET) return;
            Cookies.remove(INTRANET);
            localStorage.removeItem(INTRANET);
            setUpdateDialogShown(true);
            router.push("/welcome");
          })
          .catch((error) => console.error(error));

        return;
      }

      if (!accessToken && !refreshToken) {
        setHidden(false);
        router.push("/welcome");
      } else {
        if (accessToken) {
          const decoded: { confirmed: boolean } = jwtDecode(accessToken);
          if (decoded.confirmed === false) {
            toast("Please wait for your account to be activated", {
              className: toastClass,
              type: "info",
            });
            setHidden(false);
            router.push("/welcome");
            return;
          }
        }

        if (refreshToken) {
          const decoded: { exp: number; sub: number } = jwtDecode(refreshToken);
          const currentTime = Math.floor(Date.now() / 1000);

          if (decoded.exp < currentTime) {
            toast("Your session has expired, Please login again.", {
              className: toastClass,
              type: "warning",
            });

            apiClient
              .post(`${API_BASE}/auth/logout`, {
                userId: decoded.sub,
              })
              .then(() => {
                setHidden(false);
                if (!INTRANET) return;
                Cookies.remove(INTRANET);
                localStorage.removeItem(INTRANET);
                router.push("/welcome");
              })
              .catch((error) => console.error(error));
          } else {
            setHidden(true);
          }
        } else {
          setHidden(true);
        }
      }
    };

    checkAuth();
  }, [pathname, router, setHidden, setUpdateDialogShown]);

  return <></>;
};

export default AuthListener;
