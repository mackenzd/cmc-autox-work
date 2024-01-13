import { useEffect, useState } from "react";
import { MSRUser } from "../models/msr-user";

export function useGetUser(
  onFinish: () => void
): [
  MSRUser | undefined,
  React.Dispatch<React.SetStateAction<MSRUser | undefined>>
] {
  const [user, setUser] = useState<MSRUser | undefined>(undefined);

  useEffect(() => {
    fetch("/api/me")
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

  return [user, setUser];
}
