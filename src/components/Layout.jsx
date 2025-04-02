// src/components/Layout.jsx
import { useLocation, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Header from "./Header";
import LoginPage from "../pages/LoginPage";
import ProductList from "../pages/ProductList";
import CartPage from "../pages/CartPage";
import ProductDetail from "../pages/ProductDetail";
import RegisterPage from "../pages/RegisterPage";
import ShippingPage from "../pages/ShippingPage";
import PlaceOrderPage from "../pages/PlaceOrderPage";
import OrderPage from "../pages/OrderPage";
import PaymentPage from "../pages/PaymentPage";
import MyOrdersPage from "../pages/MyOrdersPage";
import PrivateRoute from "./PrivateRoute";
import ProfilePage from "../pages/ProfilePage";
import AdminDashboard from "../pages/AdminDashboard";
import HomeHero from "../pages/HomeHero";
import NotFoundPage from "../pages/NotFoundPage";

export default function Layout() {
  const location = useLocation();

  return (
    <>
      <Header />
      <AnimatePresence mode="wait" initial={false}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<HomeHero />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/shipping" element={<PrivateRoute><ShippingPage /></PrivateRoute>} />
          <Route path="/payment" element={<PrivateRoute><PaymentPage /></PrivateRoute>} />
          <Route path="/placeorder" element={<PrivateRoute><PlaceOrderPage /></PrivateRoute>} />
          <Route path="/order/:id" element={<PrivateRoute><OrderPage /></PrivateRoute>} />
          <Route path="/myorders" element={<PrivateRoute><MyOrdersPage /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
          <Route path="/admin" element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AnimatePresence>
    </>
  );
}
