import { useCallback, useEffect, useMemo, useState } from "react";
import {
  useGetUserRoles,
  useSetRole,
  useUnsetRole,
} from "../../../hooks/users";
import { MSRUser } from "../../../models/msr-user";
import { Role } from "../../../models/roles";

export interface UserRoleAdminProps {
  user?: MSRUser;
}

const UserRoleAdmin = (props: UserRoleAdminProps) => {
  const getUserRoles = useGetUserRoles(props.user);
  const [roles, setRoles] = useState<Role[]>([]);

  useEffect(() => {
    setRoles(getUserRoles);
  }, [getUserRoles, setRoles]);

  const onSetSuccess = useCallback(
    (role: Role) => {
      if (role) {
        setRoles((prevRoles) => [...prevRoles, role]);
      }
    },
    [roles, setRoles]
  );

  const onUnsetSuccess = useCallback(
    (role: Role) => {
      if (role) {
        setRoles((prevRoles) => prevRoles.filter((r) => r !== role));
      }
    },
    [roles, setRoles]
  );

  const setRole = useSetRole(onSetSuccess, props.user);
  const unsetRole = useUnsetRole(onUnsetSuccess, props.user);

  const onAddRole = useCallback(
    (role: Role) => {
      setRole(role);
    },
    [setRole]
  );

  const onRemoveRole = useCallback(
    (role: Role) => {
      unsetRole(role);
    },
    [unsetRole]
  );

  const badges = useMemo(() => {
    return roles.map((role) => (
      <div key={role} className="badge badge-primary gap-2 p-3 mt-1 mb-1 mr-3">
        <button onClick={() => onRemoveRole(role)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="w-4 h-4 stroke-current"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </button>
        {role}
      </div>
    ));
  }, [roles, onRemoveRole]);

  const options = useMemo(() => {
    return (
      <>
        {Object.values(Role)
          .filter((role) => {
            return !roles.includes(role);
          })
          .map((role, index) => {
            return (
              <li key={index} tabIndex={index + 1}>
                <button onClick={() => onAddRole(role)}>{role}</button>
              </li>
            );
          })}
      </>
    );
  }, [roles, onAddRole]);

  const dropdown = useMemo(() => {
    return (
      <div className="dropdown dropdown-bottom badge badge-outline p-3 mt-1 mb-1 flex">
        <button className="font-bold">Add Role</button>
        <div className="dropdown-content z-[1] shadow bg-base-100 rounded-box w-52">
          <ul className="menu menu-compact">{options}</ul>
        </div>
      </div>
    );
  }, [options]);

  return (
    <div>
      <div className="font-bold">Roles</div>
      <div className="flex flex-row">
        {badges}
        {dropdown}
      </div>
    </div>
  );
};

export default UserRoleAdmin;
