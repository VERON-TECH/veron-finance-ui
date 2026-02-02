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
const BankAccountPage = lazy(() => import("../pages/financial/BankAccount.jsx"));
const FinancialPage = lazy(() => import("../pages/financial/Financial.jsx"));
const SafePage = lazy(() => import("../pages/financial/Safe.jsx"));
const CashPage = lazy(() => import("../pages/financial/Cash.jsx"));
const MobileMoneyPage = lazy(() => import("../pages/financial/MobileMoney.jsx"));
const HomeStorePage = lazy(() => import("../pages/store/HomeStore.jsx"));
const StorePrincipalPage = lazy(() => import("../pages/store/StorePrincipal.jsx"));
const RessourcesHumanPage = lazy(() => import("../pages/ressources_human/RessourcesHuman.jsx"));
const PersonalPage = lazy(() => import("../pages/ressources_human/Personal.jsx"))
const UserPage = lazy(() => import("../pages/ressources_human/User.jsx"))
const HomeProductServicePage = lazy(() => import("../pages/product_service/HomeProductService.jsx"))
const ProductPage = lazy(() => import("../pages/product_service/Product.jsx"))
const ServicePage = lazy(() => import("../pages/product_service/Service.jsx"))


export const router = createBrowserRouter([
  { path: "", element: <Suspense fallback={<div className="text-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32"><Logo /><FontAwesomeIcon icon={faSpinner} className="animate-spin" /></div>}><AuthPage /> </Suspense> },
  {
    path: "home", element: <Suspense fallback={<div className="text-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32"><Logo /><FontAwesomeIcon icon={faSpinner} className="animate-spin" /></div>}><HomePage /> </Suspense>, action: logoutAction,
    children: [
      { index: true, element: <Suspense fallback={<div className="text-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32"><Logo /><FontAwesomeIcon icon={faSpinner} className="animate-spin" /></div>}><HomeIndexPage /></Suspense> },
      { path: "enterprise", element: <Suspense fallback={<div className="text-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32"><Logo /><FontAwesomeIcon icon={faSpinner} className="animate-spin" /></div>}><EnterprisePage /></Suspense> },
      { path: "agency", element: <Suspense fallback={<div className="text-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32"><Logo /><FontAwesomeIcon icon={faSpinner} className="animate-spin" /></div>}><AgencyPage /></Suspense> },
      { path: "financial", element: <Suspense fallback={<div className="text-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32"><Logo /><FontAwesomeIcon icon={faSpinner} className="animate-spin" /></div>}><FinancialPage /></Suspense> },
      { path: "bank-account", element: <Suspense fallback={<div className="text-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32"><Logo /><FontAwesomeIcon icon={faSpinner} className="animate-spin" /></div>}><BankAccountPage /></Suspense> },
      { path: "safe", element: <Suspense fallback={<div className="text-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32"><Logo /><FontAwesomeIcon icon={faSpinner} className="animate-spin" /></div>}><SafePage /></Suspense> },
      { path: "cash", element: <Suspense fallback={<div className="text-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32"><Logo /><FontAwesomeIcon icon={faSpinner} className="animate-spin" /></div>}><CashPage /></Suspense> },
      { path: "mobile-money", element: <Suspense fallback={<div className="text-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32"><Logo /><FontAwesomeIcon icon={faSpinner} className="animate-spin" /></div>}><MobileMoneyPage /></Suspense> },
      { path: "stores", element: <Suspense fallback={<div className="text-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32"><Logo /><FontAwesomeIcon icon={faSpinner} className="animate-spin" /></div>}><HomeStorePage /></Suspense> },
      { path: "store-principal", element: <Suspense fallback={<div className="text-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32"><Logo /><FontAwesomeIcon icon={faSpinner} className="animate-spin" /></div>}><StorePrincipalPage /></Suspense> },
      { path: "ressources-human", element: <Suspense fallback={<div className="text-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32"><Logo /><FontAwesomeIcon icon={faSpinner} className="animate-spin" /></div>}><RessourcesHumanPage /></Suspense> },
      { path: "personal", element: <Suspense fallback={<div className="text-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32"><Logo /><FontAwesomeIcon icon={faSpinner} className="animate-spin" /></div>}><PersonalPage /></Suspense> },
      { path: "user", element: <Suspense fallback={<div className="text-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32"><Logo /><FontAwesomeIcon icon={faSpinner} className="animate-spin" /></div>}><UserPage /></Suspense> },
      {
        path: "product-service", element: <Suspense fallback={<div className="text-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32"><Logo /><FontAwesomeIcon icon={faSpinner} className="animate-spin" /></div>}><HomeProductServicePage /></Suspense>,
        children: [
          { index: true, element: <Suspense fallback={<div className="text-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32"><Logo /><FontAwesomeIcon icon={faSpinner} className="animate-spin" /></div>}><ProductPage /></Suspense> },
          { path: "service", element: <Suspense fallback={<div className="text-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32"><Logo /><FontAwesomeIcon icon={faSpinner} className="animate-spin" /></div>}><ServicePage /></Suspense> },
        ]
      },

    ]
  }
])
