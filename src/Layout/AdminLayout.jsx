// src/pages/Admin/AdminLayout.jsx
import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-64 bg-gradient-to-b from-blue-800 to-blue-600 text-white p-6 shadow-lg">
        <h1 className='text-gray-900 font-extrabold text-3xl text-center'>CyberSoc Solutions</h1>
        <h2 className="text-2xl font-bold mb-10 text-center">Admin Panel</h2>
        <nav className="flex flex-col space-y-4">
          {['dashboard', 'services', 'blogs', 'products', 'settings'].map((item) => (
            <NavLink
              key={item}
              to={item === 'dashboard' ? '.' : item}
              end={item === 'dashboard'}
              className={({ isActive }) =>
                `px-4 py-2 rounded hover:bg-blue-700 hover:text-gray-800 transition-all ${
                  isActive ? 'bg-white text-gray-400  font-semibold' : 'text-white'
                }`
              }
            >
              {item.charAt(0).toUpperCase() + item.slice(1)}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
