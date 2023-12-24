import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export function useIsAuthenticated(onFinish: () => void): boolean {
  const [authenticated, setAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    fetch("/api/user")
      .then((res) => {
        if (res.ok)
        return res.json();
      })
      .then((data) => {
        if (data) {
          setAuthenticated(true);
          sessionStorage.setItem("user", JSON.stringify(data.response.profile));
        }
      }).finally(() => onFinish());
  }, [setAuthenticated]);

  return authenticated;
}

export function useLogout(): () => void {
  const navigate = useNavigate();

  const logout = useCallback(() => {
    fetch("/auth/logout").then(() => {
      sessionStorage.removeItem("user");
      navigate("/logout");
    });
  }, [navigate]);

  return logout;
}
