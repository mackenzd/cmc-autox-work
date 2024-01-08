import { Outlet } from "react-router-dom";
import { useMemo } from "react";
import Login from "./login";
import "../App.css";
import { login } from "../helpers/auth";
import Navbar from "../components/navbar";
import LoadingSpinner from "../components/loading-spinner";
import { useAuthorizationContext } from "../authorization-context";

function PageContent() {
  const { isLoading, isAuthenticated } = useAuthorizationContext();

  const pageContent = useMemo(
    () => (isAuthenticated ? <Outlet /> : <Login onClick={() => login()} />),
    [isAuthenticated]
  );

  return (
    <div className="root">
      <Navbar isAuthenticated={isAuthenticated} />
      <div className="content">
        {isLoading ? <LoadingSpinner /> : <>{pageContent}</>}
      </div>
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

export default PageContent;
