import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { FiMenu, FiHome, FiSettings, FiFileText, FiBriefcase, FiList, FiLogOut } from 'react-icons/fi';
import Logo from '../assets/cybersoc-logo.png'

const menuItems = [
  { name: 'Dashboard', icon: <FiHome />, path: '.' },
  { name: 'Services', icon: <FiList />, path: 'services' },
  { name: 'Blogs', icon: <FiFileText />, path: 'blogs' },
  { name: 'Careers', icon: <FiBriefcase />, path: 'careers' },
  { name: 'Settings', icon: <FiSettings />, path: 'settings' }
];

const AdminLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    navigate('/');
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`transition-all duration-300 bg-black/30 backdrop-blur-xl shadow-xl p-4
        ${isCollapsed ? 'w-20' : 'w-64'} flex flex-col`}
      >
        <button
          className="text-white mb-6"
          onClick={() => setIsCollapsed(!isCollapsed)}
        > 
          <FiMenu size={24} />
        </button>

        <h1
          className={`text-2xl font-bold text-white mb-8 transition-all duration-300 
          ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100'}`}
        >
          CyberSoc
        </h1>

        <nav className="flex flex-col space-y-4">
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.name === 'Dashboard'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-white/30 transition-all
                ${isActive ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white' : 'text-white'}`
              }
            >
              {item.icon}
              {!isCollapsed && <span>{item.name}</span>}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main content area with topbar */}
      <div className="flex flex-col flex-1">
        {/* Top Bar */}
        <header className="bg-white border-b-[1px] shadow-md px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img
              src={Logo} // Replace with your actual logo path
              alt="CyberSoc Logo"
              className="w-8 h-8"
            />
            <h2 className="text-xl font-bold text-gray-800">Admin Panel</h2>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
          >
            <FiLogOut /> Logout
          </button>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-8 bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
