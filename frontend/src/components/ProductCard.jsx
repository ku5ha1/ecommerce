export default function ProductCard({ product }) {
  return (
    <div className="bg-white border rounded-lg p-4 shadow hover:shadow-lg transition flex flex-col items-center">
      <img
        src={product.product_image}
        alt={product.name}
        className="w-full h-48 object-cover rounded-md mb-4"
      />
      <h3 className="font-bold text-lg mb-1 text-center">{product.name}</h3>
      <p className="text-gray-600 text-sm mb-2 text-center">{product.description}</p>
      <p className="text-xl font-semibold text-green-700 mb-2">Rs.{product.price}</p>
      <span className="text-xs text-gray-400 mb-1">In stock: {product.quantity}</span>
      <span className="text-xs bg-gray-100 rounded px-2 py-1 mt-1">{product.category?.name}</span>
    </div>
  );
}