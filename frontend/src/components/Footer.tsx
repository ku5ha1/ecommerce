// src/components/Footer.tsx
import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-black text-white py-8 text-sm shadow-inner mt-auto">
      <div className="container mx-auto px-4 flex flex-col items-center justify-between md:flex-row">
        {/* Section 1: Copyright */}
        <div className="text-center md:text-left mb-4 md:mb-0">
          <p>&copy; {new Date().getFullYear()} MyStore. All rights reserved.</p>
        </div>

        <div className="text-center md:text-left mb-4 md:mb-0">
          <ul className="flex flex-wrap justify-center gap-x-6">
            <li><Link to="/about" className="hover:text-gray-300 transition-colors duration-200">About Us</Link></li>
            <li><Link to="/contact" className="hover:text-gray-300 transition-colors duration-200">Contact</Link></li>
            <li><Link to="/privacy" className="hover:text-gray-300 transition-colors duration-200">Privacy Policy</Link></li>
            <li><Link to="/terms" className="hover:text-gray-300 transition-colors duration-200">Terms of Service</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;