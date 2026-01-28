import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router";
import { logout as logoutAction } from "../utils/logout.js"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import Logo from "../layout/LogoDark.jsx";


const AuthPage = lazy(() => import("../pages/auth/Auth.jsx"));
const HomePage = lazy(() => import("../pages/Home/Home.jsx"));
const UsersPage = lazy(() => import("../pages/Users/Users.jsx"));
const HomeIndexPage = lazy(() => import("../pages/Home/HomeIndex.jsx"));
const BddPage = lazy(() => import("../pages/Bdd/Bdd.jsx"));
const DataPage = lazy(() => import("../pages/Bdd/Data.jsx"));
const HumanPage = lazy(() => import("../pages/Users/Human.jsx"));
const BeneficiaryPage = lazy(() => import("../pages/beneficiary/Beneficiary.jsx"));
const ProjectPage = lazy(() => import("../pages/project/Project.jsx"));
const ProjectsPage = lazy(() => import("../pages/project/Projects.jsx"));
const FinancePage = lazy(() => import("../pages/project/Finance.jsx"));
const BeneficiaryDetailPage = lazy(() => import("../pages/project/BeneficiaryDetail.jsx"))
const ProjectDetailPage = lazy(() => import("../pages/beneficiary/ProjectDetails.jsx"))
const PasswordPage = lazy(() => import("../pages/users/Password.jsx"))

export const router = createBrowserRouter([
  { path: "", element: <Suspense fallback={<div className="text-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32"><Logo /><FontAwesomeIcon icon={faSpinner} className="animate-spin" /></div>}><AuthPage /> </Suspense> },
  {
    path: "home", element: <Suspense fallback={<div className="text-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32"><Logo /><FontAwesomeIcon icon={faSpinner} className="animate-spin" /></div>}><HomePage /> </Suspense>, action: logoutAction,
    children: [
      { index: true, element: <Suspense fallback={<div className="text-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32"><Logo /><FontAwesomeIcon icon={faSpinner} className="animate-spin" /></div>}><HomeIndexPage /></Suspense> },
      { path: "human", element: <Suspense fallback={<div className="text-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32"><Logo /><FontAwesomeIcon icon={faSpinner} className="animate-spin" /></div>}><HumanPage /></Suspense> },
      { path: "users", element: <Suspense fallback={<div className="text-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32"><Logo /><FontAwesomeIcon icon={faSpinner} className="animate-spin" /></div>}><UsersPage /></Suspense> },
      { path: "password", element: <Suspense fallback={<div className="text-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32"><Logo /><FontAwesomeIcon icon={faSpinner} className="animate-spin" /></div>}><PasswordPage /></Suspense> },
      { path: "data", element: <Suspense fallback={<div className="text-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32"><Logo /><FontAwesomeIcon icon={faSpinner} className="animate-spin" /></div>}><DataPage /></Suspense> },
      { path: "import", element: <Suspense fallback={<div className="text-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32"><Logo /><FontAwesomeIcon icon={faSpinner} className="animate-spin" /></div>}><BddPage /></Suspense> },
      {
        path: "beneficiary", element: <Suspense fallback={<div className="text-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32"><Logo /><FontAwesomeIcon icon={faSpinner} className="animate-spin" /></div>}><BeneficiaryPage /></Suspense>,
        children: [
          { path: ":id", element: <Suspense fallback={<div className="text-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32"><Logo /><FontAwesomeIcon icon={faSpinner} className="animate-spin" /></div>}><ProjectDetailPage /></Suspense> }
        ]
      },
      { path: "projects", element: <Suspense fallback={<div className="text-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32"><Logo /><FontAwesomeIcon icon={faSpinner} className="animate-spin" /></div>}><ProjectsPage /></Suspense> },
      {
        path: "project", element: <Suspense fallback={<div className="text-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32"><Logo /><FontAwesomeIcon icon={faSpinner} className="animate-spin" /></div>}><ProjectPage /></Suspense>,
        children: [
          { path: ":id", element: <Suspense fallback={<div className="text-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32"><Logo /><FontAwesomeIcon icon={faSpinner} className="animate-spin" /></div>}><BeneficiaryDetailPage /></Suspense> }
        ]
      },
      { path: "finance", element: <Suspense fallback={<div className="text-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32"><Logo /><FontAwesomeIcon icon={faSpinner} className="animate-spin" /></div>}><FinancePage /></Suspense> }
    ]
  }
])
