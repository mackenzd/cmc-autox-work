import { useLogout } from "../hooks/auth";
import { useGetUser } from "../hooks/user";

const UserAvatar = () => {
  const user = useGetUser();
  const logout = useLogout();

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
          <li>
            <button onClick={() => logout()}>Logout</button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default UserAvatar;
