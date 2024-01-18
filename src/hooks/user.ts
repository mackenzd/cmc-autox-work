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

export function useGetUserRoles(user?: MSRUser): string[] {
  const [roles, setRoles] = useState<string[]>([]);

  useEffect(() => {
    fetch(`/api/user/${user?.id}/roles`)
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        return Promise.reject(res);
      })
      .then((data) => {
        setRoles(data);
      })
      .catch((error) => console.log(error));
  }, [user?.id, setRoles]);

  return roles;
}

export function useGetUsers(): MSRUser[] {
  const [users, setUsers] = useState<MSRUser[]>([]);

  useEffect(() => {
    fetch(`/api/user/all`)
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        return Promise.reject(res);
      })
      .then((data) => {
        setUsers(data);
      })
      .catch((error) => console.log(error));
  }, [setUsers]);

  return users;
}

