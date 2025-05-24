import React from 'react';
import { Link } from 'react-router-dom';

const ServiceList = ({ services, onDelete }) => {
  return (
    <div className="space-y-4">
      {services.map((service) => (
        <div key={service.id} className="flex items-center justify-between bg-gray-100 p-4 rounded-lg">
          <h3>{service.title}</h3>
          <div className="space-x-2">
          <Link to={`/dashboard/services/edit/${service.id}`} className="text-blue-500">Edit</Link>
            <button onClick={() => onDelete(service.id)} className="text-red-500">Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ServiceList;
