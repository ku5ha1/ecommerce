import React from "react";
import { BrowserRouter } from "react-router-dom";
import RouteTree from "./routes/RouteTree";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";

function App() {
  return (
    <AuthProvider>
      <CartProvider>
    <BrowserRouter>
      <RouteTree />
    </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;