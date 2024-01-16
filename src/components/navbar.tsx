import { useMemo } from "react";
import UserAvatar from "./user";
import { useAuthorizationContext } from "../authorization-context";

const Navbar = () => {
  const { isAuthenticated } = useAuthorizationContext();

  const avatar = useMemo(() => {
    if (isAuthenticated) {
      return (
        <div className="p-3">
          <UserAvatar />
        </div>
      );
    } else {
      return <></>;
    }
  }, [isAuthenticated]);

  return (
    <div className="navbar bg-base-200 header">
        <a href="/" className="font-semibold no-animation text-xl">
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
          <div className="flex-none hidden sm:block">
            <ul className="menu menu-horizontal px-1">
              <li>
                <a
                  href="https://cumberlandmotorclub.com/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Cumberland Motor Club
                </a>
              </li>
              <li>
                <a
                  href="https://cumberlandmotorclub.com/autox-results"
                  target="_blank"
                  rel="noreferrer"
                >
                  Results
                </a>
              </li>
              <li>
                <a
                  href="https://live.cumberlandmotorclub.com/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Live Timing
                </a>
              </li>
            </ul>
          </div>
          {avatar}
      </div>
    </div>
  );
};

export default Navbar;
