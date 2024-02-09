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
    <div className="avatar dropdown dropdown-bottom dropdown-end">
      <div className="bg-neutral text-neutral-content rounded-full w-12">
        <div tabIndex={0} role="button">
          <img src={user?.avatar} alt="User avatar" />
        </div>
        <ul
          tabIndex={0}
          className="menu menu-compact dropdown-content z-[1] shadow bg-base-100 rounded-box w-52"
        >
          {options}
        </ul>
      </div>
    </div>
  );
};

export default UserAvatar;
