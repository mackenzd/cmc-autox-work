import { useNavigate } from "react-router-dom";
import { useAuthorizationContext } from "../contexts/authorization-context";
import { useLogout } from "../hooks/auth";
import { useMemo } from "react";
import { closeDropdownOnClick } from "../helpers/utils";

const UserAvatar = () => {
  const { user, isAdmin } = useAuthorizationContext();
  const logout = useLogout();
  const navigate = useNavigate();

  const options = useMemo(() => {
    const logoutButton = (
      <li>
        <button
          onClick={() => {
            closeDropdownOnClick(() => logout());
          }}
        >
          Logout
        </button>
      </li>
    );

    if (isAdmin) {
      return (
        <>
          <li>
            <button
              onClick={() => {
                closeDropdownOnClick(() => navigate("/admin"));
              }}
            >
              Admin
            </button>
          </li>
          {logoutButton}
        </>
      );
    } else {
      return logoutButton;
    }
  }, [logout, isAdmin, navigate]);

  return (
    <div className="avatar rounded-full ring-1 ring-primary ring-offset-base-200 ring-offset-2 dropdown dropdown-bottom dropdown-end align-middle">
      <div className="bg-neutral text-neutral-content rounded-full w-12">
        <div tabIndex={0} role="button">
          <img src={user?.avatar} alt="User avatar" />
        </div>
        <ul
          tabIndex={0}
          className="menu menu-compact dropdown-content z-[1] shadow bg-base-100 rounded-box w-52 outline outline-1"
        >
          {options}
        </ul>
      </div>
    </div>
  );
};

export default UserAvatar;
