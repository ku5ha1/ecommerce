import React from 'react';
import { Link } from 'react-router-dom'; 
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

function Header() {
  const { cart } = useCart();
  const { token, logout } = useAuth();

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <header className="sticky top-0 bg-gray-800 text-white p-4 shadow-md z-50">
      <nav className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-blue-300 hover:text-blue-200 transition-colors duration-200">
          MyStore Ecommerce
        </Link>

        <ul className="flex space-x-6 items-center">
          <li>
            <Link to="/" className="text-lg hover:text-blue-300 transition-colors duration-200">
              Home
            </Link>
          </li>
          <li>
            <Link to="/shop" className="text-lg hover:text-blue-300 transition-colors duration-200">
              Shop
            </Link>
          </li>
          <li className="relative">
            <Link to="/cart" className="text-lg hover:text-blue-300 transition-colors duration-200 flex items-center">
              Cart
              {cartItemCount > 0 && (
                <span className="ml-1 bg-red-500 text-white text-xs rounded-full px-2 py-1 animate-pulse">
                  {cartItemCount}
                </span>
              )}
            </Link>
          </li>
          {token ? (
            <>
              <li>
                <Link to="/profile" className="text-lg hover:text-blue-300 transition-colors duration-200">
                  Profile
                </Link>
              </li>
              <li>
                <button 
                  onClick={logout}
              className="text-lg hover:text-blue-300 transition-colors duration-200"
            >
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login" className="text-lg hover:text-blue-300 transition-colors duration-200">
              Login
            </Link>
          </li>
          <li>
                <Link to="/register" className="text-lg hover:text-blue-300 transition-colors duration-200">
              Register
            </Link>
          </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}

export default Header;