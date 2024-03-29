import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import App from "../App";
import Events from "../features/events";
import { ErrorBoundary } from "react-error-boundary";
import { Path } from "./path";
import PageNotFound from "../components/errors/page_not_found";
import Admin from "../features/admin";
import { useAuthorizationContext } from "../contexts/authorization-context";

const errorBoundaryErrorHandler = () => {
  return;
};

const ErrorBoundaryLayout = () => (
  <ErrorBoundary
    FallbackComponent={PageNotFound}
    onError={errorBoundaryErrorHandler}
  >
    <Outlet />
  </ErrorBoundary>
);

const ProtectedAdmin = () => {
  const { isAdmin } = useAuthorizationContext();

  if (!isAdmin) {
    return <PageNotFound />;
  }

  return <Admin />;
};

const router = createBrowserRouter([
  {
    element: <ErrorBoundaryLayout />,
    children: [
      {
        element: <App />,
        errorElement: <PageNotFound />,
        children: [
          {
            path: Path.Unknown,
            element: <Navigate replace to={Path.Events} />,
          },
          {
            path: Path.Events,
            element: <Events />,
            errorElement: <PageNotFound />,
          },
          {
            path: Path.Admin,
            element: <ProtectedAdmin />,
            errorElement: <PageNotFound />,
          },
          {
            path: Path.Logout,
            element: <Navigate replace to={Path.Logout} />,
            errorElement: <PageNotFound />,
          },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <PageNotFound />,
    errorElement: <PageNotFound />,
  },
]);

export default router;
