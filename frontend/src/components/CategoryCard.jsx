export default function CategoryCard({ category }) {
    return (
      <div className="bg-white border rounded-lg p-4 shadow hover:shadow-lg transition flex flex-col items-center">
        <img
          src={category.category_image}
          alt={category.name}
          className="w-full h-48 object-cover rounded-md mb-4"
        />
        <h3 className="font-bold text-lg mb-1 text-center">{category.name}</h3>
      </div>
    );
  }