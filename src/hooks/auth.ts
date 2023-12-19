import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export function useIsAuthenticated(): boolean {
  const [authenticated, setAuthenticated] = useState<boolean>(false);

  const user = () => {
    return sessionStorage.getItem("user");
  };

  useEffect(() => {
    fetch("/api/user")
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          setAuthenticated(true);
          sessionStorage.setItem("user", JSON.stringify(data.response.profile));
        }
      });
  }, [setAuthenticated]);

  return authenticated;
}

export function useLogout(): () => void {
  const navigate = useNavigate();

  const logout = useCallback(() => {
    fetch("/auth/logout").then(() => {
      navigate("/logout");
      sessionStorage.removeItem("user");
    });
  }, [navigate]);

  return logout;
}
