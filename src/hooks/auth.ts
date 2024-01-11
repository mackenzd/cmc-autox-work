import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

export function useLogout(): () => void {
  const navigate = useNavigate();

  const logout = useCallback(() => {
    fetch("/auth/logout")
      .then((res) => {
        if (res.ok) {
          navigate("/logout");
        }
        return Promise.reject(res);
      })
      .catch((error) => console.log(error));
  }, [navigate]);

  return logout;
}
