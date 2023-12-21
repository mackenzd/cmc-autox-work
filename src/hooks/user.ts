import { useEffect, useState } from "react";
import { MSRUser } from "../models/msr-user";

export function useGetUser(): MSRUser | null {
  const [user, setUser] = useState<MSRUser | null>(null);

  useEffect(() => {
    fetch("/api/user")
      .then((res) => res.json())
      .then((data) => {
        setUser(data.response.profile);
      });
  }, [setUser]);

  return user;
}
