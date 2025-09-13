import React from "react";
import AdminContactMessages from "../components/contactComponents/AdminContactMessages";
import AdminServicesDropdown from "../components/contactComponents/AdminServicesDropdown";

const AdminContactDashboard = () => {
  return (
    <div className="p-6 space-y-10">
      {/* Page Heading */}
      <h1 className="text-3xl font-bold mb-6 text-gray-900">📬 Contact Dashboard</h1>

      {/* Contact Messages Section (Top) */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-md p-6 overflow-x-auto">
        <h2 className="text-xl font-semibold mb-4">📩 Contact Messages</h2>
        <AdminContactMessages />
      </div>

      {/* Manage Dropdown Services Section (Bottom) */}
      <div className="bg-white md:w-1/2 border border-gray-200 rounded-xl shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">⚙️ Manage Services</h2>
        <AdminServicesDropdown />
      </div>
    </div>
  );
};

export default AdminContactDashboard;
