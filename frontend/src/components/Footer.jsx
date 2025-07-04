import React from 'react';

function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8 shadow-inner mt-auto">
      <div className="container mx-auto px-4 text-center">
        <p className="text-lg font-semibold mb-4">MyStore Ecommerce</p>
        <p className="text-sm mb-2">&copy; {new Date().getFullYear()} All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;