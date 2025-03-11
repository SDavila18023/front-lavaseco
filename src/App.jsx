import { RouterProvider, createBrowserRouter } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import BillingPage from "./pages/BillingPage";
import InventoryPage from "./pages/InventoryPage";
import HomePage from "./pages/HomePage";
import NotFoundPage from "./utils/NotFoundPage";
import ProtectedRoute from "./utils/ProtectedRoute";
import CostPage from "./pages/CostPage";
import SpecificCostPage from "./pages/SpecificCostPage";
import SupplyPage from "./pages/SupplyPage";
import PayrollPage from "./pages/PayrollPage";
import ReportPage from "./pages/ReportPage";
import AdminProtectedRoute from "./utils/AdminProtectedRoute";
import AdminPage from "./pages/AdminPage";

const routes = [
  { path: "/", element: <LoginPage /> },
  {
    path: "/home",
    element: (
      <ProtectedRoute>
        <HomePage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/billing",
    element: (
      <ProtectedRoute>
        <BillingPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/inventory",
    element: (
      <ProtectedRoute>
        <InventoryPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/reports",
    element: (
      <ProtectedRoute>
        <ReportPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/costs",
    element: (
      <ProtectedRoute>
        <CostPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/costs/specific",
    element: (
      <ProtectedRoute>
        <SpecificCostPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/costs/supply",
    element: (
      <ProtectedRoute>
        <SupplyPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/costs/employability",
    element: (
      <ProtectedRoute>
        <PayrollPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/users",
    element: (
      <AdminProtectedRoute>
        <AdminPage />
      </AdminProtectedRoute>
    )
  },
  { path: "*", element: <NotFoundPage /> },
];

const router = createBrowserRouter(routes);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
