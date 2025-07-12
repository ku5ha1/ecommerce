import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { getProducts } from '../services/productService';
import ProductCard from './ProductCard';

function RelatedProducts({ currentProductId, currentCategoryId }) {
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [comboProducts, setComboProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const [comboAdded, setComboAdded] = useState(false);

  useEffect(() => {
    const loadRelatedProducts = async () => {
      try {
        setLoading(true);
        const allProducts = await getProducts();
        
        // Filter related products (same category, exclude current product)
        const related = allProducts
          .filter(product => 
            product.category_id == currentCategoryId && 
            product.id != currentProductId
          )
          .slice(0, 4); // Show max 4 related products
        
        setRelatedProducts(related);

        // Create combo products (dummy data - in real app this would come from analytics)
        const combo = allProducts
          .filter(product => product.id != currentProductId)
          .slice(0, 3); // Show 3 combo products
        
        setComboProducts(combo);
      } catch (err) {
        console.error("Error loading related products:", err);
      } finally {
        setLoading(false);
      }
    };

    loadRelatedProducts();
  }, [currentProductId, currentCategoryId]);

  const handleAddComboToCart = () => {
    comboProducts.forEach(product => {
      addToCart(product);
    });
    setComboAdded(true);
    
    setTimeout(() => {
      setComboAdded(false);
    }, 2000);
  };

  if (loading) return <div className="text-center py-8">Loading related products...</div>;

  return (
    <div className="bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        {/* Frequently Bought Together Section */}
        {comboProducts.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Frequently Bought Together
            </h2>
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {comboProducts.map((product, index) => (
                  <div key={product.id} className="text-center">
                    <img
                      src={product.product_image}
                      alt={product.name}
                      className="w-24 h-24 object-cover rounded-lg mx-auto mb-2"
                    />
                    <h3 className="font-semibold text-sm mb-1">{product.name}</h3>
                    <p className="text-green-600 font-semibold">Rs.{product.price}</p>
                    {index < comboProducts.length - 1 && (
                      <div className="text-2xl text-gray-400 mt-2">+</div>
                    )}
                  </div>
                ))}
              </div>
              <div className="text-center">
                <div className="mb-2">
                  <span className="text-lg font-semibold text-gray-900">
                    Total: Rs.{comboProducts.reduce((sum, product) => sum + product.price, 0)}
                  </span>
                  <span className="text-green-600 ml-2 font-semibold">
                    Save Rs.200
                  </span>
                </div>
                <button
                  onClick={handleAddComboToCart}
                  disabled={comboAdded}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                    comboAdded
                      ? 'bg-green-600 text-white cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700 hover:scale-105 transform'
                  }`}
                >
                  {comboAdded ? '✓ Combo Added!' : 'Add Combo to Cart'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Related Products
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}

        {/* View All Products Link */}
        <div className="text-center mt-8">
          <Link 
            to="/shop" 
            className="text-blue-600 hover:underline font-semibold"
          >
            View All Products →
          </Link>
        </div>
      </div>
    </div>
  );
}

export default RelatedProducts; 