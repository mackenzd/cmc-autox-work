import UserAvatar from "./user";

export interface NavbarProps {
  isAuthenticated: boolean;
}

const Navbar = (props: NavbarProps) => {
  const isAuthenticated = props.isAuthenticated;

  return (
    <div className="navbar bg-base-100 header">
      <a href="/home" className="p-3 font-semibold no-animation text-xl">
        <img
          style={{ width: "15%", height: "15%" }}
          src="/large-cmc-logo.png"
          alt="Cumberland Motor Club logo"
        />
        <span className="p-3">
          Cumberland Motor Club
          <br />
          Work Assignments
        </span>
      </a>
      <div>
        <div className="flex-none">
          <ul className="menu menu-horizontal px-1">
            <li>
              <a href="https://cumberlandmotorclub.com/" target="_blank">Cumberland Motor Club</a>
            </li>
            <li>
              <a href="https://cumberlandmotorclub.com/autox-results" target="_blank">Results</a>
            </li>
            <li>
              <a href="https://live.cumberlandmotorclub.com/" target="_blank">Live Timing</a>
            </li>
          </ul>
        </div>
        {isAuthenticated ? (
          <div className="p-3">
            <UserAvatar />
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default Navbar;
