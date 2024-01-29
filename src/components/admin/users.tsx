import { useMemo, useState } from "react";
import { useGetUsers } from "../../hooks/user";
import { MSRUser } from "../../models/msr-user";

const UserAdmin = () => {
  const [value, setValue] = useState<string>("");
  const [user, setUser] = useState<MSRUser | undefined>(undefined);
  const users = useGetUsers();

  const handleClick = (user: MSRUser) => {
    const elem = document.activeElement;
    if (elem) {
      (elem as HTMLElement).blur()
    }

    setUser(user);
    setValue(`${user.firstName} ${user.lastName}`);
  };

  const options = useMemo(() => {
    return (
      <>
        {users
          .filter((user) => {
            return `${user.firstName} ${user.lastName}`
              .toLowerCase()
              .includes(value.toLowerCase());
          })
          .map((user, index) => {
            const userFullName = `${user.firstName} ${user.lastName}`;
            return (
              <li key={index} tabIndex={index + 1}>
                <button
                  onClick={() => handleClick(user)}
                >
                  {userFullName}
                </button>
              </li>
            );
          })}
      </>
    );
  }, [users, value]);

  const dropdown = useMemo(() => {
    return (
      <div className="dropdown dropdown-bottom dropdown-start">
        <label className="form-control w-full max-w-xs">
          <div className="label">
            <span className="label-text">User Admin</span>
          </div>
          <input
            type="text"
            placeholder="Enter member's name..."
            className="input input-bordered w-full max-w-xs"
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
            }}
          />
        </label>
        <div className="dropdown-content z-[1] shadow bg-base-100 rounded-box w-52">
          <ul className="menu menu-compact">{options}</ul>
        </div>
      </div>
    );
  }, [value, options]);

  return (
    <div className="justify-start user-admin">
      {dropdown}
      <div>{user?.email}</div>
    </div>
  );
};

export default UserAdmin;
