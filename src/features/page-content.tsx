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
      <Navbar />
      <div className="p-5 border-t bg-base-200 border-indigo-400 content">
        {isLoading ? <LoadingSpinner /> : <>{pageContent}</>}
      </div>
      <footer className="footer border-t bg-base-200 border-base-300">
        <div className="justify-self-end">
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
        </div>
      </footer>
    </div>
  );
}

export default PageContent;
