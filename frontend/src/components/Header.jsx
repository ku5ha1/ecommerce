import React from 'react';
import { Link } from 'react-router-dom'; 

function Header() {
  return (
    <header className="bg-gray-800 text-white p-4 shadow-md">
      <nav className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-blue-300 hover:text-blue-200 transition-colors duration-200">
          MyStore Ecommerce
        </Link>

        {/* Navigation Links */}
        <ul className="flex space-x-6">
          <li>
            <Link 
              to="/" 
              className="text-lg hover:text-blue-300 transition-colors duration-200"
            >
              Home
            </Link>
          </li>
          <li>
            <Link 
              to="/login" 
              className="text-lg hover:text-blue-300 transition-colors duration-200"
            >
              Login
            </Link>
          </li>
          <li>
            <Link 
              to="/register" 
              className="text-lg hover:text-blue-300 transition-colors duration-200"
            >
              Register
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;