import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getProductsByCategory } from "../services/productService";
import { getCategories } from "../services/categoryService";
import ProductCard from "../components/ProductCard";

function CategoryDetailPage() {
  const { id } = useParams();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadCategoryData = async () => {
      try {
        setLoading(true);
        
        // Load products for this specific category
        const categoryData = await getProductsByCategory(id);
        console.log("Category data:", categoryData);
        
        // Ensure we have an array of products
        const categoryProducts = Array.isArray(categoryData) ? categoryData : [];
        setProducts(categoryProducts);

        // Load category details
        const allCategories = await getCategories();
        const currentCategory = allCategories.find(cat => cat.id == id);
        console.log("Current category:", currentCategory);
        setCategory(currentCategory);

      } catch (err) {
        setError(err.message);
        console.error("Fetch category data error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadCategoryData();
  }, [id]);

  if (loading) return <div className="container mx-auto px-4 py-8 text-center">Loading...</div>;
  if (error) return <div className="container mx-auto px-4 py-8 text-center text-red-600">Error: {error}</div>;
  if (!category) return <div className="container mx-auto px-4 py-8 text-center">Category not found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link to="/shop" className="text-blue-600 hover:underline mb-4 inline-block">
          ← Back to Shop
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{category.name}</h1>
        <p className="text-gray-600">Browse all {category.name} products</p>
        <p className="text-sm text-gray-500 mt-2">Category ID: {id} | Products found: {products.length}</p>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No products found in this category.</p>
          <p className="text-sm text-gray-500 mt-2">Category ID: {id}</p>
          <Link to="/shop" className="text-blue-600 hover:underline mt-4 inline-block">
            Browse other categories
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

export default CategoryDetailPage; 