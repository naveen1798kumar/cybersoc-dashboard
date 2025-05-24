import React from 'react';
import { Link } from 'react-router-dom';

const CategoryList = ({ categories = [], onDelete }) => {
  if (!Array.isArray(categories)) {
    console.error("Expected 'categories' to be an array, but got:", typeof categories, categories);
    return <div>No categories available.</div>;
  }

  return (
    <div className="space-y-4">
      {categories.map((category) => (
        <div key={category.id} className="flex items-center justify-between bg-gray-100 p-4 rounded-lg">
          <h3>{category.title}</h3>
          <div className="space-x-2">
            <Link to={`/dashboard/services/edit/${category.id}`} className="text-blue-500">Edit</Link>
            <button onClick={() => onDelete(category.id)} className="text-red-500">Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CategoryList;
