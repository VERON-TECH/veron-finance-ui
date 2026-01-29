import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router";
import { logout as logoutAction } from "../utils/logout.js"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import Logo from "../layout/LogoDark.jsx";


const AuthPage = lazy(() => import("../pages/auth/Auth.jsx"));
const HomePage = lazy(() => import("../pages/Home/Home.jsx"));
const HomeIndexPage = lazy(() => import("../pages/Home/HomeIndex.jsx"));
const EnterprisePage = lazy(() => import("../pages/enterprise/Enterprise.jsx"));
const AgencyPage = lazy(() => import("../pages/agency/Agency.jsx"));


export const router = createBrowserRouter([
  { path: "", element: <Suspense fallback={<div className="text-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32"><Logo /><FontAwesomeIcon icon={faSpinner} className="animate-spin" /></div>}><AuthPage /> </Suspense> },
  {
    path: "home", element: <Suspense fallback={<div className="text-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32"><Logo /><FontAwesomeIcon icon={faSpinner} className="animate-spin" /></div>}><HomePage /> </Suspense>, action: logoutAction,
    children: [
      { index: true, element: <Suspense fallback={<div className="text-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32"><Logo /><FontAwesomeIcon icon={faSpinner} className="animate-spin" /></div>}><HomeIndexPage /></Suspense> },
      { path: "enterprise", element: <Suspense fallback={<div className="text-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32"><Logo /><FontAwesomeIcon icon={faSpinner} className="animate-spin" /></div>}><EnterprisePage /></Suspense> },
      { path: "agency", element: <Suspense fallback={<div className="text-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32"><Logo /><FontAwesomeIcon icon={faSpinner} className="animate-spin" /></div>}><AgencyPage /></Suspense> },


    ]
  }
])
