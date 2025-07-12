import Header from "../components/Header";
import Footer from "../components/Footer";
import Toast from "../components/Toast";
import FloatingCart from "../components/FloatingCart";
import { Outlet } from "react-router-dom";
import { useCart } from "../context/CartContext";

function MainLayout() {
  const { toast, closeToast } = useCart();

  return (
    <>
      <Header />
      <Outlet />
      <Footer />
      <FloatingCart />
      <Toast 
        message={toast.message} 
        isVisible={toast.isVisible} 
        onClose={closeToast} 
      />
    </>
  );
}

export default MainLayout;
