import { useNavigate } from "react-router-dom";
import { useAuthorizationContext } from "../authorization-context";
import { useLogout } from "../hooks/auth";
import { useMemo } from "react";

const UserAvatar = () => {
  const { user, isAdmin } = useAuthorizationContext();
  const logout = useLogout();
  const navigate = useNavigate();

  const logoutButton = (
    <li>
      <button onClick={() => logout()}>Logout</button>
    </li>
  );
  const dropdownItems = useMemo(() => {
    if (isAdmin) {
      return (
        <>
          <li>
            <button onClick={() => navigate("/admin")}>Admin</button>
          </li>
          {logoutButton}
        </>
      );
    } else {
      return logoutButton;
    }
  }, [isAdmin, logoutButton]);

  return (
    <div className="avatar dropdown dropdown-bottom dropdown-end">
      <div className="bg-neutral text-neutral-content rounded-full w-12">
        <div tabIndex={0} role="button">
          <img src={user?.avatar} />
        </div>
        <ul
          tabIndex={0}
          className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
        >
          {dropdownItems}
        </ul>
      </div>
    </div>
  );
};

export default UserAvatar;
