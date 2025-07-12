import { Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import AdminLayout from "../layouts/AdminLayout";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import AdminLoginPage from "../pages/auth/AdminLoginPage";
import CartPage from "../pages/CartPage";
import ProductDetailPage from "../pages/ProductDetailPage";
import ShopPage from "../pages/ShopPage";
import CategoryDetailPage from "../pages/CategoryDetailPage";
import CheckoutPage from "../pages/CheckoutPage";
import ProfilePage from "../pages/user/ProfilePage";
import AdminPage from "../pages/AdminPage";

function RouteTree() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="product/:id" element={<ProductDetailPage />} />
        <Route path="shop" element={<ShopPage />} />
        <Route path="category/:id" element={<CategoryDetailPage />} />
        <Route path="checkout" element={<CheckoutPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>
      
      {/* Admin Routes - Separate Layout */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminPage />} />
      </Route>
      
      {/* Admin Login - No Layout */}
      <Route path="/admin/login" element={<AdminLoginPage />} />
    </Routes>
  );
}

export default RouteTree;