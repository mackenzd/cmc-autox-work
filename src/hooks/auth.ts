import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

export function useLogout(): () => void {
  const navigate = useNavigate();

  const logout = useCallback(() => {
    fetch("/auth/logout").then(() => {
      navigate("/logout");
    });
  }, [navigate]);

  return logout;
}
