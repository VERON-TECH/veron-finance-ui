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
const StorePage = lazy(() => import("../pages/store/Store.jsx"));
const PurchaseOrderPage = lazy(() => import("../pages/store/PurchaseOrder.jsx"));
const RessourcesHumanPage = lazy(() => import("../pages/ressources_human/RessourcesHuman.jsx"));
const PersonalPage = lazy(() => import("../pages/ressources_human/Personal.jsx"))
const UserPage = lazy(() => import("../pages/ressources_human/User.jsx"))
const HomeProductServicePage = lazy(() => import("../pages/product_service/HomeProductService.jsx"))
const ProductPage = lazy(() => import("../pages/product_service/Product.jsx"))
const ServicePage = lazy(() => import("../pages/product_service/Service.jsx"))
const HomeBudgetPage = lazy(() => import("../pages/budget/HomeBudget.jsx"))
const BudgetPage = lazy(() => import("../pages/budget/Budget.jsx"))
const SpentPage = lazy(() => import("../pages/budget/Spent.jsx"))
const SupplierPage = lazy(() => import("../pages/supplier/Supplier.jsx"))
const ErrorPage = lazy(() => import("../pages/error/Error.jsx"))
const ApproStockPage = lazy(() => import("../pages/store/ApproStock.jsx"))
const ProductStockPage = lazy(() => import("../pages/store/ProductStock.jsx"))
const EngagementPage = lazy(() => import("../pages/engagement/Engagement.jsx"))
const InvoicePage = lazy(() => import("../pages/engagement/Invoice.jsx"))
const InvoiceSupplierPage = lazy(() => import("../pages/engagement/InvoiceSupplier.jsx"))
const SupplierAdvancePage = lazy(() => import("../pages/engagement/SupplierAdvance.jsx"))
const SalePage = lazy(() => import("../pages/sale/Sale.jsx"))
const InvoiceSalePage = lazy(() => import("../pages/sale/InvoiceSale.jsx"))
const MvtCashPage = lazy(() => import("../pages/cash/MvtCash.jsx"))
const MissingPage = lazy(() => import("../pages/cash/Missing.jsx"))
const SurplusPage = lazy(() => import("../pages/cash/Surplus.jsx"))
const PrintSalePage = lazy(() => import("../pages/print/PrintSale.jsx"))
const CashReportPage = lazy(() => import("../pages/print/PrintCash.jsx"))
const DashBoardPage = lazy(() => import("../pages/dashboard/Dashboard.jsx"))
const DashBoardDayPage = lazy(() => import("../pages/dashboard/DashBooardDay.jsx"))
const PrintPurchaseOrderPage = lazy(() => import("../pages/print/PrintPurchaseOrder.jsx"))






export const router = createBrowserRouter([
  { path: "", element: <Suspense fallback={<div className="text-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32"><Logo /><FontAwesomeIcon icon={faSpinner} className="animate-spin" /></div>}><AuthPage /> </Suspense>, errorElement: <ErrorPage /> },
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
      { path: "store", element: <Suspense fallback={<div className="text-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32"><Logo /><FontAwesomeIcon icon={faSpinner} className="animate-spin" /></div>}><StorePage /></Suspense> },
      { path: "purchase-order", element: <Suspense fallback={<div className="text-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32"><Logo /><FontAwesomeIcon icon={faSpinner} className="animate-spin" /></div>}><PurchaseOrderPage /></Suspense> },
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
      { path: "budgets", element: <Suspense fallback={<div className="text-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32"><Logo /><FontAwesomeIcon icon={faSpinner} className="animate-spin" /></div>}><HomeBudgetPage /></Suspense> },
      { path: "spent", element: <Suspense fallback={<div className="text-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32"><Logo /><FontAwesomeIcon icon={faSpinner} className="animate-spin" /></div>}><SpentPage /></Suspense> },
      { path: "budget", element: <Suspense fallback={<div className="text-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32"><Logo /><FontAwesomeIcon icon={faSpinner} className="animate-spin" /></div>}><BudgetPage /></Suspense> },
      { path: "supplier", element: <Suspense fallback={<div className="text-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32"><Logo /><FontAwesomeIcon icon={faSpinner} className="animate-spin" /></div>}><SupplierPage /></Suspense> },
      { path: "mvt-stock", element: <Suspense fallback={<div className="text-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32"><Logo /><FontAwesomeIcon icon={faSpinner} className="animate-spin" /></div>}><ApproStockPage /></Suspense> },
      { path: "product-stock", element: <Suspense fallback={<div className="text-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32"><Logo /><FontAwesomeIcon icon={faSpinner} className="animate-spin" /></div>}><ProductStockPage /></Suspense> },
      { path: "engagement", element: <Suspense fallback={<div className="text-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32"><Logo /><FontAwesomeIcon icon={faSpinner} className="animate-spin" /></div>}><EngagementPage /></Suspense> },
      { path: "invoice-customer", element: <Suspense fallback={<div className="text-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32"><Logo /><FontAwesomeIcon icon={faSpinner} className="animate-spin" /></div>}><InvoicePage /></Suspense> },
      { path: "invoice-supplier", element: <Suspense fallback={<div className="text-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32"><Logo /><FontAwesomeIcon icon={faSpinner} className="animate-spin" /></div>}><InvoiceSupplierPage /></Suspense> },
      { path: "advance-paid", element: <Suspense fallback={<div className="text-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32"><Logo /><FontAwesomeIcon icon={faSpinner} className="animate-spin" /></div>}><SupplierAdvancePage /></Suspense> },
      { path: "sale", element: <Suspense fallback={<div className="text-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32"><Logo /><FontAwesomeIcon icon={faSpinner} className="animate-spin" /></div>}><SalePage /></Suspense> },
      { path: "invoice", element: <Suspense fallback={<div className="text-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32"><Logo /><FontAwesomeIcon icon={faSpinner} className="animate-spin" /></div>}><InvoiceSalePage /></Suspense> },
      { path: "mvt-cash", element: <Suspense fallback={<div className="text-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32"><Logo /><FontAwesomeIcon icon={faSpinner} className="animate-spin" /></div>}><MvtCashPage /></Suspense> },
      { path: "missing", element: <Suspense fallback={<div className="text-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32"><Logo /><FontAwesomeIcon icon={faSpinner} className="animate-spin" /></div>}><MissingPage /></Suspense> },
      { path: "surplus", element: <Suspense fallback={<div className="text-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32"><Logo /><FontAwesomeIcon icon={faSpinner} className="animate-spin" /></div>}><SurplusPage /></Suspense> },
      { path: "surplus", element: <Suspense fallback={<div className="text-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32"><Logo /><FontAwesomeIcon icon={faSpinner} className="animate-spin" /></div>}><SurplusPage /></Suspense> },
      { path: "reporting", element: <Suspense fallback={<div className="text-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32"><Logo /><FontAwesomeIcon icon={faSpinner} className="animate-spin" /></div>}><DashBoardPage /></Suspense> },
      { path: "day", element: <Suspense fallback={<div className="text-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32"><Logo /><FontAwesomeIcon icon={faSpinner} className="animate-spin" /></div>}><DashBoardDayPage /></Suspense> },
    ]

  },
  { path: "/print-sale", element: <Suspense fallback={<div className="text-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32"><Logo /><FontAwesomeIcon icon={faSpinner} className="animate-spin" /></div>}><PrintSalePage /></Suspense> },
  { path: "/print-cash", element: <Suspense fallback={<div className="text-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32"><Logo /><FontAwesomeIcon icon={faSpinner} className="animate-spin" /></div>}><CashReportPage /></Suspense> },
  { path: "/print-purchase", element: <Suspense fallback={<div className="text-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32"><Logo /><FontAwesomeIcon icon={faSpinner} className="animate-spin" /></div>}><PrintPurchaseOrderPage /></Suspense> },

])
