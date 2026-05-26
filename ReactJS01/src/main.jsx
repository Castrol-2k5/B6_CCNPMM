import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import App from "./App";
import store from "./Redux/store";
import HomePage from "./pages/home";
import LoginPage from "./pages/login";
import RegisterPage from "./pages/register";
import ForgotPasswordPage from "./pages/forgot-password";
import ProductDetailPage from "./pages/product-detail";
import ProfilePage from "./pages/profile";
import CartPage from "./pages/cart";
import CheckoutPage from "./pages/checkout";
import OrdersPage from "./pages/orders";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsersPage from "./pages/admin/AdminUsersPage";
import AdminProductsPage from "./pages/admin/AdminProductsPage";
import AdminOrdersPage from "./pages/admin/AdminOrdersPage";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import RoleRoute from "./components/auth/RoleRoute";
import "./styles/global.css";

const router = createBrowserRouter([
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/",
        element: <App />,
        children: [
          {
            index: true,
            element: <HomePage />,
          },
          {
            path: "products/:slug",
            element: <ProductDetailPage />,
          },
          {
            path: "profile",
            element: <ProfilePage />,
          },
          {
            path: "cart",
            element: <CartPage />,
          },
          {
            path: "checkout",
            element: <CheckoutPage />,
          },
          {
            path: "orders",
            element: <OrdersPage />,
          },
          {
            path: "admin",
            element: <RoleRoute allowedRoles={["admin"]} />,
            children: [
              {
                path: "",
                element: <AdminLayout />,
                children: [
                  {
                    index: true,
                    element: <AdminDashboard />,
                  },
                  {
                    path: "users",
                    element: <AdminUsersPage />,
                  },
                  {
                    path: "products",
                    element: <AdminProductsPage />,
                  },
                  {
                    path: "orders",
                    element: <AdminOrdersPage />,
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPasswordPage />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>,
);
