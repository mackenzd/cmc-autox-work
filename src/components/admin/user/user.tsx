import { useMemo, useState } from "react";
import { useGetUsers } from "../../../hooks/users";
import UserRoleAdmin from "./role";

const UserAdmin = () => {
  const [userInput, setUserInput] = useState<string>("");
  const users = useGetUsers();

  const options = useMemo(() => {
    return (
      <>
        {users
          .filter((user) => {
            return (
              `${user.firstName} ${user.lastName}`
                .toLowerCase()
                .includes(userInput.toLowerCase()) ||
              `${user.lastName} ${user.firstName}`
                .toLowerCase()
                .includes(userInput.toLowerCase()) ||
              `${user.lastName}, ${user.firstName}`
                .toLowerCase()
                .includes(userInput.toLowerCase())
            );
          })
          .sort((u1, u2) => (u1.lastName > u2.lastName ? 1 : -1))
          .map((user, index) => {
            return (
              <tr key={user.id}>
                <td className="pl-0">{index + 1}</td>
                <td>
                  {user.lastName}, {user.firstName}
                </td>
                <td>{user.email}</td>
                <td><UserRoleAdmin user={user} /></td>
              </tr>
            );
          })}
      </>
    );
  }, [users, userInput]);

  const dropdown = useMemo(() => {
    return (
      <div className="dropdown dropdown-bottom dropdown-start py-2">
        <label className="input input-bordered input-primary flex gap-2">
          <input
            type="text"
            placeholder="Enter member's name..."
            className="bg-base-100 grow"
            value={userInput}
            onChange={(e) => {
              setUserInput(e.target.value);
            }}
          />
          <button onClick={() => setUserInput("")}>✕</button>
        </label>
      </div>
    );
  }, [userInput]);

  return (
    <div className="flex flex-col">
      <div className="font-bold text-lg">User Administration</div>
      <div className="flex flex-row gap-5">{dropdown}</div>
        <table className="table table-sm table-zebra">
          <thead>
            <tr>
              <th></th>
              <th>Name</th>
              <th>Email</th>
              <th>Roles</th>
            </tr>
          </thead>
          <tbody>{options}</tbody>
        </table>
    </div>
  );
};

export default UserAdmin;
