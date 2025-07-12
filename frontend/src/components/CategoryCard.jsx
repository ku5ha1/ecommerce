import { Link } from 'react-router-dom';

export default function CategoryCard({ category }) {
  return (
    <Link 
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
      </div>
    </Link>
  );
}