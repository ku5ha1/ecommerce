import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCategories } from "../services/categoryService";

function ShopPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (err) {
        setError(err.message);
        console.error("Fetch categories error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  if (loading) return <div className="container mx-auto px-4 py-8 text-center">Loading...</div>;
  if (error) return <div className="container mx-auto px-4 py-8 text-center text-red-600">Error: {error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Shop by Category</h1>
        <p className="text-gray-600">Browse our products by category</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {categories.map(category => (
          <Link 
            key={category.id} 
            to={`/category/${category.id}`}
            className="block bg-white border rounded-lg p-4 shadow hover:shadow-lg transition transform hover:scale-105"
          >
            <div className="flex flex-col items-center">
              <img
                src={category.category_image}
                alt={category.name}
                className="w-full h-48 object-cover rounded-md mb-4"
              />
              <h3 className="font-bold text-lg mb-1 text-center">{category.name}</h3>
              <p className="text-gray-600 text-sm text-center">Browse {category.name} products</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default ShopPage; 