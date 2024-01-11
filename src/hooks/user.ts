import { useEffect, useState } from "react";
import { MSRUser } from "../models/msr-user";

export function useGetUser(onFinish: () => void): MSRUser | undefined {
  const [user, setUser] = useState<MSRUser | undefined>(undefined);

  useEffect(() => {
    fetch("/api/user")
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        return Promise.reject(res);
      })
      .then((data) => {
        setUser(data.response.profile);
      })
      .catch((error) => console.log(error))
      .finally(() => onFinish());
  }, [setUser]);

  return user;
}
