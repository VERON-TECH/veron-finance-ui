import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";

const AuthPage = lazy(() => import("../pages/auth/Auth.jsx"))

const router = createBrowserRouter([
    { path: "", element: <Suspense fallback={<p>Loading...</p>}><AuthPage /></Suspense> }
])

export default router;