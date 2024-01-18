import { useMemo, useState } from "react";
import { useGetUsers } from "../../hooks/user";
import { MSRUser } from "../../models/msr-user";

const UserAdmin = () => {
  const [value, setValue] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);
  const [user, setUser] = useState<MSRUser | undefined>(undefined);
  const users = useGetUsers();

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
                  onClick={() => {
                    setUser(user);
                    setValue(userFullName);
                    setOpen(false);
                  }}
                >
                  {userFullName}
                </button>
              </li>
            );
          })}
      </>
    );
  }, [users, value, setValue, open, setOpen]);

  const classNames = useMemo(() => {
    console.log(open)
    
    if (open) {
      return "dropdown dropdown-bottom dropdown-start dropdown-open";
    } else {
      return "dropdown dropdown-bottom dropdown-start";
    }
  }, [open, setOpen]);

  return (
    <div className="justify-start user-admin">
      <div className={classNames}>
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

      <div>{user?.email}</div>
    </div>
  );
};

export default UserAdmin;
