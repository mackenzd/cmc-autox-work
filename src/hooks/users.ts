import { useEffect, useState } from "react";
import { MSRUser } from "../models/msr-user";
import { Role } from "../models/roles";
import { MSREvent } from "../models/msr-event";

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

export function useGetUserRoles(user?: MSRUser): Role[] {
  const [roles, setRoles] = useState<Role[]>([]);

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
        }
        return Promise.reject(res);
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
        }
        return Promise.reject(res);
      })
      .catch((error) => console.log(error));
  };

  return unsetRole;
}

export function useCanPreregister(user?: MSRUser, event?: MSREvent): boolean {
  const [canPreregister, setCanPreregister] = useState<boolean>(false);

  useEffect(() => {
    fetch(`/api/user/${user?.id}/can_preregister/${event?.id}`)
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        return Promise.reject(res);
      })
      .then((data) => {
        setCanPreregister(data);
      })
      .catch((error) => console.log(error));
  }, [setCanPreregister]);

  return canPreregister;
}
