import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import api from '../services/axiosInstance';

function ProductDetailPage() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/products/${id}`);
        setProduct(response.data);
      } catch (err) {
        setError(err.message);
        console.error("Fetch product error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      // Add the product with the selected quantity
      for (let i = 0; i < quantity; i++) {
        addToCart(product);
      }
      setIsAdded(true);
      
      // Reset the button after 2 seconds
      setTimeout(() => {
        setIsAdded(false);
      }, 2000);
    }
  };

  if (loading) return <div className="container mx-auto px-4 py-8 text-center">Loading...</div>;
  if (error) return <div className="container mx-auto px-4 py-8 text-center text-red-600">Error: {error}</div>;
  if (!product) return <div className="container mx-auto px-4 py-8 text-center">Product not found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-4">
        <Link to="/" className="text-blue-600 hover:underline">
          ← Back to Products
        </Link>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="space-y-4">
          <img
            src={product.product_image}
            alt={product.name}
            className="w-full h-96 object-cover rounded-lg shadow-lg"
          />
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
            <p className="text-2xl font-semibold text-green-700 mb-4">Rs.{product.price}</p>
            <p className="text-gray-600 text-lg leading-relaxed">{product.description}</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <span className="text-gray-700 font-medium">Quantity:</span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 transition"
                >
                  -
                </button>
                <span className="px-4 py-1 bg-gray-100 rounded">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 transition"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-gray-700 font-medium">Stock:</span>
              <span className={`px-2 py-1 rounded text-sm ${
                product.quantity > 0 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {product.quantity > 0 ? `${product.quantity} available` : 'Out of stock'}
              </span>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={isAdded || product.quantity === 0}
              className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-300 ${
                isAdded
                  ? 'bg-green-600 text-white cursor-not-allowed'
                  : product.quantity === 0
                  ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700 hover:scale-105 transform'
              }`}
            >
              {isAdded ? '✓ Added to Cart!' : product.quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-2">Product Details</h3>
            <div className="space-y-2 text-gray-600">
              <p><strong>Category:</strong> {product.category?.name || 'Uncategorized'}</p>
              <p><strong>Product ID:</strong> {product.id}</p>
              <p><strong>Price:</strong> Rs.{product.price}</p>
              <p><strong>Available:</strong> {product.quantity} units</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailPage; 