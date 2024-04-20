import { useCallback, useEffect, useMemo, useState } from "react";
import { useSetRole, useUnsetRole } from "../../../hooks/users";
import { MSRUser } from "../../../models/msr-user";
import { Role } from "../../../models/roles";
import { useAuthorizationContext } from "../../../contexts/authorization-context";
import { closeDropdownOnClick } from "../../../helpers/utils";

export interface UserRoleAdminProps {
  user?: MSRUser;
}

const UserRoleAdmin = (props: UserRoleAdminProps) => {
  const { user } = useAuthorizationContext();

  const [roles, setRoles] = useState<Role[]>([]);
  useEffect(() => {
    if (props.user?.roles) {
      setRoles(props.user.roles);
    }
  }, [setRoles, props.user?.roles]);

  const onSetSuccess = useCallback(
    (role: Role) => {
      if (role) {
        setRoles((prevRoles) => [...prevRoles, role]);
      }
    },
    [setRoles]
  );

  const onUnsetSuccess = useCallback(
    (role: Role) => {
      if (role) {
        setRoles((prevRoles) => prevRoles.filter((r) => r !== role));
      }
    },
    [setRoles]
  );

  const setRole = useSetRole(onSetSuccess, props.user);
  const unsetRole = useUnsetRole(onUnsetSuccess, props.user);

  const badges = useMemo(() => {
    return (
      <div className="flex flex-row">
        {roles.map((role) => (
          <div
            key={role}
            className="badge badge-primary gap-2 p-3 mt-1 mb-1 mr-3"
          >
            {props.user?.id === user?.id ? (
              <></>
            ) : (
              <button onClick={() => unsetRole(role)}>
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
            )}
            {role}
          </div>
        ))}
      </div>
    );
  }, [roles, unsetRole, props.user?.id, user?.id]);

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
                <button
                  onClick={() =>
                    closeDropdownOnClick(() => {
                      setRole(role);
                    })
                  }
                >
                  {role}
                </button>
              </li>
            );
          })}
      </>
    );
  }, [roles, setRole]);

  const dropdown = useMemo(() => {
    return props.user?.id === user?.id ? (
      <></>
    ) : (
      <div className="dropdown dropdown-right badge badge-outline p-3 mt-1 mb-1 flex">
        <button className="font-bold">Add Role</button>
        <div className="dropdown-content z-[1] shadow bg-base-100 rounded-box w-52 outline outline-1">
          <ul className="menu menu-compact">{options}</ul>
        </div>
      </div>
    );
  }, [options, props.user?.id, user?.id]);

  return (
    <div>
      <div className="flex flex-row">
        {badges}
        {dropdown}
      </div>
    </div>
  );
};

export default UserRoleAdmin;
