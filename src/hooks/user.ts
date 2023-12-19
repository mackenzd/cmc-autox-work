import { useEffect, useState } from "react";
import { User } from "../models/user";

export function useGetUser(): User | null {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    fetch("/api/user")
      .then((res) => res.json())
      .then((data) => {
        setUser(data.response.profile);
      });
  }, [setUser]);

  return user;
}
