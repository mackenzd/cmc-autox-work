import { useEffect, useState } from "react";
import { MSRUser } from "../models/msr-user";
import { Role } from "../models/roles";

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
    // eslint-disable-next-line
  }, [setUser]);

  return [user, setUser];
}

export function useGetUserRoles(user?: MSRUser): Role[] {
  const [roles, setRoles] = useState<Role[]>([]);

  useEffect(() => {
    if (user?.id) {
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
    }
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

export function useSetRole(
  onSuccess: (role: Role) => void,
  user?: MSRUser
): (role: Role) => void {
  const setRole = (role: Role) => {
    fetch(`/api/user/${user?.id}/roles`, {
      method: "POST",
      body: JSON.stringify({ role: role }),
    })
      .then((res) => {
        if (res.ok) {
          onSuccess(role);
        } else {
          return Promise.reject(res);
        }
      })
      .catch((error) => console.log(error));
  };

  return setRole;
}

export function useUnsetRole(
  onSuccess: (role: Role) => void,
  user?: MSRUser
): (role: Role) => void {
  const unsetRole = (role: Role) => {
    fetch(`/api/user/${user?.id}/roles`, {
      method: "DELETE",
      body: JSON.stringify({ role: role }),
    })
      .then((res) => {
        if (res.ok) {
          onSuccess(role);
        } else {
          return Promise.reject(res);
        }
      })
      .catch((error) => console.log(error));
  };

  return unsetRole;
}

export function useGetPreregistration(user?: MSRUser): string[] {
  const [getPreregistration, setGetPreregistration] = useState<string[]>([]);

  useEffect(() => {
    if (user?.id) {
      fetch(`/api/user/${user?.id}/preregistration`)
        .then((res) => {
          if (res.ok) {
            return res.json();
          }
          return Promise.reject(res);
        })
        .then((data) => {
          setGetPreregistration(data);
        })
        .catch((error) => console.log(error));
    }
  }, [user?.id, setGetPreregistration]);

  return getPreregistration;
}
