// src/pages/Admin/AdminDashboard.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('isAdmin') !== 'true') {
      navigate('/admin');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    navigate('/admin');
  };

  const cards = [
    { title: 'Total Services', value: 12 },
    { title: 'Blog Posts', value: 8 },
    { title: 'Products', value: 5 },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card) => (
          <div
            key={card.title}
            className="bg-white p-6 rounded-lg shadow hover:shadow-md transition"
          >
            <h2 className="text-xl font-semibold text-gray-700">{card.title}</h2>
            <p className="text-3xl font-bold mt-2 text-blue-600">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 text-gray-600">
        <p>This area can later show charts, recent activity logs, or messages.</p>
      </div>
    </div>
  );
};

export default AdminDashboard;
