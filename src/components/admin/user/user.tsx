import { useMemo, useState } from "react";
import { useGetUsers } from "../../../hooks/users";
import { MSRUser } from "../../../models/msr-user";
import UserRoleAdmin from "./role";

const UserAdmin = () => {
  const [value, setValue] = useState<string>("");
  const [user, setUser] = useState<MSRUser | undefined>(undefined);
  const users = useGetUsers();

  const handleClick = (user: MSRUser) => {
    const elem = document.activeElement;
    if (elem) {
      (elem as HTMLElement).blur();
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
                <button onClick={() => handleClick(user)}>
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
        <label className="form-control w-full">
          <div className="label">
            <span className="label-text">Member</span>
          </div>
          <input
            type="text"
            placeholder="Enter member's name..."
            className="input input-bordered w-full"
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
      <div className="font-bold text-lg">User Admin</div>
      <div className="flex flex-row gap-5">{dropdown}</div>
      <div className="flex flex-col mt-10 gap-3">
        {user ? (
          <>
            {" "}
            <div>
              <div className="font-bold">MSR ID</div>
              <div>{user?.id}</div>
            </div>
            <div>
              <div className="font-bold">Name</div>
              <div>
                {user?.firstName} {user?.lastName}
              </div>
            </div>
            <div>
              <div className="font-bold">Email</div>
              <div>{user?.email}</div>
            </div>
            <div>
              <UserRoleAdmin user={user} />
            </div>
          </>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default UserAdmin;
