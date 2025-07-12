import { useCart } from '../context/CartContext';
import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = (e) => {
    e.preventDefault(); // Prevent navigation when clicking the button
    e.stopPropagation(); // Stop event bubbling
    addToCart(product);
    setIsAdded(true);
    
    // Reset the button after 2 seconds
    setTimeout(() => {
      setIsAdded(false);
    }, 2000);
  };

  return (
    <Link 
      to={`/product/${product.id}`}
      className="block bg-white border rounded-lg p-4 shadow hover:shadow-lg transition transform hover:scale-105"
    >
      <div className="flex flex-col items-center">
        <img
          src={product.product_image}
          alt={product.name}
          className="w-full h-48 object-cover rounded-md mb-4"
        />
        <h3 className="font-bold text-lg mb-1 text-center">{product.name}</h3>
        <p className="text-gray-600 text-sm mb-2 text-center">{product.description}</p>
        <p className="text-xl font-semibold text-green-700 mb-2">Rs.{product.price}</p>
        <span className="text-xs text-gray-400 mb-1">In stock: {product.quantity}</span>
        
        <div className="flex space-x-2 mt-2">
          <button 
            onClick={handleAddToCart}
            disabled={isAdded}
            className={`px-4 py-2 text-sm rounded transition-all duration-300 cursor-pointer ${
              isAdded 
                ? 'bg-green-600 text-white cursor-not-allowed' 
                : 'bg-blue-600 text-white hover:bg-blue-700 hover:scale-105 transform'
            }`}
          >
            {isAdded ? '✓ Added!' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </Link>
  );
}