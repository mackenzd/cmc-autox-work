import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthorizationContext } from "../authorization-context";

export function useLogout(): () => void {
  const navigate = useNavigate();
  const { setUser } = useAuthorizationContext();

  const logout = useCallback(() => {
    fetch("/auth/logout")
      .then((res) => {
        if (res.ok) {
          setUser(undefined);
          navigate("/logout");
        }
        return Promise.reject(res);
      })
      .catch((error) => console.log(error));
  }, [navigate]);

  return logout;
}
