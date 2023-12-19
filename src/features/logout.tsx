import { login } from "../helpers/auth";
import Login from "./login";

const Logout = () => {
  return (
    <div>
      <div className="logout-msg">You have been logged out.</div>
      <Login onClick={() => login()} />
    </div>
  );
};

export default Logout;
