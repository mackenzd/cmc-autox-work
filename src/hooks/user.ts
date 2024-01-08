import { useEffect, useState } from "react";
import { MSRUser } from "../models/msr-user";

export function useGetUser(onFinish: () => void): MSRUser | undefined {
  const [user, setUser] = useState<MSRUser | undefined>(undefined);

  useEffect(() => {
    fetch("/api/user")
      .then((res) => res.json())
      .then((data) => {
        setUser(data.response.profile);
      }).finally(() => onFinish());
  }, [setUser]);

  return user;
}
