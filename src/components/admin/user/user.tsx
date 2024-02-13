import { useMemo, useState } from "react";
import { useGetUsers } from "../../../hooks/users";
import { MSRUser } from "../../../models/msr-user";
import UserRoleAdmin from "./role";
import { closeDropdownOnClick } from "../../../helpers/utils";

const UserAdmin = () => {
  const [userInput, setUserInput] = useState<string>("");
  const [user, setUser] = useState<MSRUser | undefined>(undefined);
  const users = useGetUsers();

  const options = useMemo(() => {
    return (
      <>
        {users
          .filter((user) => {
            return `${user.firstName} ${user.lastName}`
              .toLowerCase()
              .includes(userInput.toLowerCase()) ||
              `${user.lastName} ${user.firstName}`
              .toLowerCase()
              .includes(userInput.toLowerCase()) ||
              `${user.lastName}, ${user.firstName}`
              .toLowerCase()
              .includes(userInput.toLowerCase());
          })
          .sort((u1, u2) => u1.lastName > u2.lastName ? 1 : -1)
          .slice(0, 5)
          .map((user, index) => {
            return (
              <li key={index} tabIndex={index + 1}>
                <button
                  onClick={() =>
                    closeDropdownOnClick(() => {
                      setUser(user);
                      setUserInput("");
                    })
                  }
                >
                  {`${user.lastName}, ${user.firstName}`}
                </button>
              </li>
            );
          })}
      </>
    );
  }, [users, userInput]);

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
            value={userInput}
            onChange={(e) => {
              setUserInput(e.target.value);
            }}
          />
        </label>
        <div className="dropdown-content z-[1] shadow bg-base-100 rounded-box w-52 outline outline-1">
          <ul className="menu menu-compact">{options}</ul>
        </div>
      </div>
    );
  }, [userInput, options]);

  return (
    <div className="flex flex-col">
      <div className="font-bold text-lg">User Administration</div>
      <div className="flex flex-row gap-5">{dropdown}</div>
      <div className="flex flex-col mt-10 gap-3">
        {user ? (
          <>
            <div>
              <div className="font-bold">User ID</div>
              <div>{user?.id}</div>
            </div>
            <div>
              <div className="font-bold">Member ID</div>
              <div>{user?.memberId ? user.memberId : "-"}</div>
            </div>
            <div>
              <div className="font-bold">Name</div>
              <div>
                {user?.firstName} {user?.lastName}
              </div>
            </div>
            <div>
              <div className="font-bold">Email</div>
              <div>{user?.email ? user.email : "-"}</div>
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
