import React from "react";
import { Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import ProductList from "./pages/ProductList";
import ProductDetails from "./pages/ProductDetails";
import Auth from "./pages/Auth";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Cart from "./pages/Cart";
import Favourites from "./pages/Favourites";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import About from "./pages/About";
import Profile from "./pages/Profile";
import { AdminRoute, UserRoute } from "./routes/ProtectedRoute";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminLayout from "./pages/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminCommerce from "./pages/admin/AdminCommerce";
import AdminCategories from "./pages/admin/AdminCategories";

function UserLayout({ children }) {
  return <Layout>{children}</Layout>;
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<UserLayout><Home /></UserLayout>} />
        <Route path="/dress" element={<UserLayout><ProductList category="Women’s Dress" /></UserLayout>} />
        <Route path="/jewellery" element={<UserLayout><ProductList category="Jewellery" /></UserLayout>} />
        <Route path="/product/:id" element={<UserLayout><ProductDetails /></UserLayout>} />
        <Route path="/login" element={<UserLayout><Auth /></UserLayout>} />
        <Route path="/register" element={<UserLayout><Auth registerMode /></UserLayout>} />
        <Route path="/forgot-password" element={<UserLayout><ForgotPassword /></UserLayout>} />
        <Route path="/reset-password/:token" element={<UserLayout><ResetPassword /></UserLayout>} />
        <Route path="/about" element={<UserLayout><About /></UserLayout>} />
        <Route path="/cart" element={<UserLayout><UserRoute><Cart /></UserRoute></UserLayout>} />
        <Route path="/favourites" element={<UserLayout><UserRoute><Favourites /></UserRoute></UserLayout>} />
        <Route path="/checkout" element={<UserLayout><Checkout /></UserLayout>} />
        <Route path="/orders" element={<UserLayout><UserRoute><Orders /></UserRoute></UserLayout>} />
        <Route path="/profile" element={<UserLayout><UserRoute><Profile /></UserRoute></UserLayout>} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="commerce" element={<AdminCommerce />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}
