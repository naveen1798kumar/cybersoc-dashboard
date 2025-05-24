import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import servicesData from '../data/servicesData';
import ServiceForm from '../components/adminComponents/ServiceForm';

const EditServicePage = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const [categoryId, setCategoryId] = useState(null);
  const [service, setService] = useState(null);
  const [categoryTitle, setCategoryTitle] = useState('');
  const [updatedCategoryTitle, setUpdatedCategoryTitle] = useState('');
  const [services, setServices] = useState([]);

  useEffect(() => {
    let foundService = null;
    let categoryData = null;
  
    console.log("Services Data:", servicesData); // Log the entire data
    console.log("Looking for service with ID:", serviceId); // Log the serviceId
  
    for (const [category, data] of Object.entries(servicesData)) {
      const match = data.services.find((srv) => srv.id === serviceId);
      if (match) {
        foundService = match;
        categoryData = data;
        setCategoryId(category);
        break;
      }
    }
  
    if (foundService) {
      setService(foundService);
      setCategoryTitle(categoryData.title);
      setUpdatedCategoryTitle(categoryData.title);
      setServices(categoryData.services);
    } else {
      console.error("Service not found for ID:", serviceId);
    }

    
  }, [serviceId]);


  

  const handleCategoryTitleChange = (e) => {
    setUpdatedCategoryTitle(e.target.value); // Update category title while editing
  };

  const handleSubmit = (updatedData) => {
    // You can integrate API or local state update here for services and category
    console.log("Updated Category Title:", updatedCategoryTitle);
    console.log("Updated Service Data:", updatedData);
    navigate("/admin/services"); // Redirect after saving
  };

  if (!service || !categoryId) return <div>Loading service data...</div>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Edit Service</h2>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Category Title</label>
        <input
          type="text"
          value={updatedCategoryTitle}
          onChange={handleCategoryTitleChange}
          className="p-2 border border-gray-300 rounded w-full"
        />
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-semibold">Services in {categoryTitle}</h3>
        <ul className="space-y-2">
          {services.map((srv) => (
            <li key={srv.id}>
              <div className="flex justify-between items-center">
                <span>{srv.name}</span>
                <button
                  className="text-blue-500"
                  onClick={() => setService(srv)} // Set the service to be edited
                >
                  Edit
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {service && (
        <ServiceForm initialData={service} onSubmit={handleSubmit} />
      )}
    </div>
  );
};

export default EditServicePage;
