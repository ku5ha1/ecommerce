import { useEffect, useState } from "react";
import { getProducts } from "../services/ProductService";
import { getCategories } from "../services/categoryService"; // Import the category service
import ProductCard from "../components/ProductCard";
import CategoryCard from "../components/CategoryCard"; // Import the CategoryCard component

function HomePage() {
  // State for Products
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true); // Renamed for clarity
  const [productsError, setProductsError] = useState(null);    // Renamed for clarity

  // State for Categories
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState(null);


  // Effect to load Products
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (err) {
        setProductsError(err.message);
        console.error("Fetch products error:", err);
      } finally {
        setProductsLoading(false);
      }
    };

    loadProducts();
  }, []); // Empty dependency array means this runs once on mount


  // Effect to load Categories
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (err) {
        setCategoriesError(err.message);
        console.error("Fetch categories error:", err);
      } finally {
        setCategoriesLoading(false);
      }
    };

    loadCategories();
  }, []); // Empty dependency array means this runs once on mount


  // Combined loading/error handling for initial render
  if (productsLoading || categoriesLoading) return <p className="text-center py-8">Loading...</p>;
  if (productsError || categoriesError) {
    return (
      <p className="text-center text-red-600 py-8">
        Error: {productsError || categoriesError}
      </p>
    );
  }

  // Slice products to display only the first 8
  const productsToDisplay = products.slice(0, 8);

  // Take the first 3 categories, assuming your API might return more
  const categoriesToDisplay = categories.slice(0, 3);


  return (
    <div>
      {/* Banner Section */}
      <div className="relative h-64 bg-gray-800 text-white flex items-center justify-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1463320898484-cdee8141c787?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" // Replace with your actual banner image path
          alt="Banner"
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Discover Our Latest Collection!</h1>
          <p className="text-xl md:text-2xl">Quality products, unbeatable prices.</p>
        </div>
      </div>

      {/* --- New Category Section --- */}
      <h2 className="text-3xl font-bold text-center mt-10 mb-6">Our Categories</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-8">
        {categoriesToDisplay.map(category => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>

      {/* Products Section */}
      <h2 className="text-3xl font-bold text-center mt-10 mb-6">Featured Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-8">
        {productsToDisplay.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

export default HomePage;