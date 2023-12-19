import { Outlet, useBlocker } from "react-router-dom";
import { useMemo } from "react";
import Login from "./features/login";
import "./App.css";
import { useIsAuthenticated } from "./hooks/auth";
import { login } from "./helpers/auth";
import User from "./components/user";

function App() {
  const isAuthenticated = useIsAuthenticated();

  const pageContent = useMemo(
    () => (isAuthenticated ? <Outlet /> : <Login onClick={() => login()} />),
    [isAuthenticated]
  );

  return (
    <div className="root">
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
        {isAuthenticated ? <div className="p-3"><User /></div> : <></>}
      </div>
      <div className="content">{pageContent}</div>
      <footer className="footer">
        <a
          href="https://motorsportreg.com"
          style={{ display: "inline-block", padding: "15px" }}
        >
          <img
            src="https://msr-hotlink.s3.amazonaws.com/powered-by/powered-by-msr-outline@2x.png"
            alt="Online registration and event management service for motorsport events powered by MotorsportReg.com"
            title="Online registration and event management service for motorsport events powered by MotorsportReg.com"
            style={{ width: "165px", height: "29px" }}
          />
        </a>
      </footer>
    </div>
  );
}

export default App;
