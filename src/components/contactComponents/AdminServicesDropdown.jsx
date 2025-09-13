import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminServicesDropdown = () => {
  const [services, setServices] = useState([]);
  const [newService, setNewService] = useState("");

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/api/dropdown-services");
      setServices(data.services);
    } catch (error) {
      console.error("Error fetching services", error);
    }
  };

  const addService = async () => {
    if (!newService.trim()) return;
    try {
      await axios.post("http://localhost:5000/api/dropdown-services", { name: newService });
      setNewService("");
      fetchServices();
    } catch (error) {
      console.error("Error adding service", error);
    }
  };

  const deleteService = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/dropdown-services/${id}`);
      fetchServices();
    } catch (error) {
      console.error("Error deleting service", error);
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-xl font-bold mb-4">Manage Contact Form Services</h2>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={newService}
          onChange={(e) => setNewService(e.target.value)}
          placeholder="Enter new service"
          className="border p-2 rounded-lg w-full"
        />
        <button
          onClick={addService}
          className="bg-[#027070] text-white px-4 py-2 rounded-lg"
        >
          Add
        </button>
      </div>

      <ul className="space-y-2">
        {services.map((service) => (
          <li
            key={service._id}
            className="flex justify-between items-center border-b py-2"
          >
            <span>{service.name}</span>
            <button
              onClick={() => deleteService(service._id)}
              className="text-red-500 hover:underline"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminServicesDropdown;
