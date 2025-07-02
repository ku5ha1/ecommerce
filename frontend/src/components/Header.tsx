import { Link } from "react-router-dom";
import logo from "../assets/MyStore_logo.png"
import { FaShoppingCart, FaUser } from 'react-icons/fa';

const Header = () => {
  return (
    <>

      <div className="bg-sky-800 text-white text-center py-2 text-sm font-medium">
        Welcome to MyStore
      </div>

      <header className="text-black p-4 flex items-center justify-between shadow-md">

        <div>
          <Link to="/">
            <img src={logo} alt="MyStore Logo" className="h-10" />
          </Link>
        </div>
        <div className="flex items-center gap-x-6">
          <nav>
            <ul className="flex items-center gap-x-4">
              <li>
                <Link to="/" className="text-lg hover:text-sky-800 transition-colors duration-200">Home</Link>
              </li>
              <li>
                <Link to="/products" className="text-lg hover:text-sky-800 transition-colors duration-200">Flowers</Link>
              </li>
              <li>
                <Link to="/cart" className="text-lg hover:text-sky-800 transition-colors duration-200">Bouquets</Link>
              </li>
              <li>
                <Link to="/cart" className="text-lg hover:text-sky-800 transition-colors duration-200">Plants</Link>
              </li>
            </ul>
          </nav>

          <div className="flex items-center gap-x-4">

            <Link to="/cart" className="relative hover:text-sky-800 transition-colors duration-200">
              <FaShoppingCart className="text-xl" />
            </Link>

            <Link to="/login" className="hover:text-sky-800 transition-colors duration-200">
              <FaUser className="text-xl" />
            </Link>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;