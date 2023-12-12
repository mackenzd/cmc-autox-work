import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import App from "../App"
import Home from "../features/home";
import { ErrorBoundary } from "react-error-boundary";
import { Path } from "./path";
import PageNotFound from "../components/errors/page_not_found";

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
            element: <Navigate replace to={Path.Home} />,
          },
          {
            path: "/home",
            element: <Home />,
            errorElement: <PageNotFound />,
          },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <PageNotFound />,
    errorElement: <PageNotFound />
  },
]);

export default router
