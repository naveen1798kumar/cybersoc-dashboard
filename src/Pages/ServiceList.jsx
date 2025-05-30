import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ServiceList = () => {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios.get('/api/services').then(res => setServices(res.data || []));
    axios.get('/api/categories').then(res => setCategories(res.data || []));
  }, []);

  const getCategoryTitle = (catId) =>
    categories.find(cat => cat._id === catId)?.title || 'Unknown';

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">All Services</h1>
      <ul>
        {services.map(service => (
          <li key={service._id} className="mb-4">
            <Link
              to={`/services/${service._id}`}
              className="text-blue-700 hover:underline text-lg"
            >
              {service.title}
            </Link>
            <div className="text-sm text-gray-500">
              Category: {getCategoryTitle(service.category)}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ServiceList;