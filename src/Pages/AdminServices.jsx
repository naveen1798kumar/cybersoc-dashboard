import React, { useState, useEffect } from 'react';
import CategoryList from '../components/adminComponents/CategoryList';
import CategoryForm from '../components/adminComponents/CategoryForm';
import ServiceList from '../components/adminComponents/ServiceList';
import ServiceForm from '../components/adminComponents/ServiceForm';
import { createCategory, updateCategory, deleteCategory } from '../data/services';
import servicesData from '../data/servicesData'; // Import data


const AdminServices = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [isEditingCategory, setIsEditingCategory] = useState(false);
  const [isEditingService, setIsEditingService] = useState(false);

  // Load categories from the services data (or API if needed)
  useEffect(() => {
    if (servicesData && typeof servicesData === 'object') {
      const loadedCategories = Object.entries(servicesData).map(([key, value]) => ({
        id: key,
        ...value,
      }));
      setCategories(loadedCategories);
    } else {
      console.error("servicesData is not a valid object:", servicesData);
    }
    // setCategories(servicesData);  // Assume servicesData is the path to your categories data
  }, []);

  // Handle creating or updating categories
  const handleCategorySubmit = (categoryData) => {
    if (selectedCategory) {
      // Update existing category
      updateCategory(selectedCategory.id, categoryData)
        .then(() => {
          setCategories(
            categories.map((category) =>
              category.id === selectedCategory.id ? { ...category, ...categoryData } : category
            )
          );
          setSelectedCategory(null);
        })
        .catch((error) => console.error(error));
    } else {
      // Create new category
      createCategory(categoryData)
        .then((newCategory) => {
          setCategories([...categories, newCategory]);
        })
        .catch((error) => console.error(error));
    }
    setIsEditingCategory(false);
  };

  // Handle deleting a category
  const handleDeleteCategory = (id) => {
    deleteCategory(id)
      .then(() => {
        setCategories(categories.filter((category) => category.id !== id));
      })
      .catch((error) => console.error(error));
  };

  // Handle creating or updating services
  const handleServiceSubmit = (serviceData) => {
    if (selectedService) {
      // Update service
      const updatedCategories = categories.map((category) =>
        category.id === selectedCategory.id
          ? {
              ...category,
              services: category.services.map((service) =>
                service.id === selectedService.id ? { ...service, ...serviceData } : service
              ),
            }
          : category
      );
      setCategories(updatedCategories);
      setSelectedService(null);
    } else {
      // Add new service
      const updatedCategories = categories.map((category) =>
        category.id === selectedCategory.id
          ? { ...category, services: [...category.services, serviceData] }
          : category
      );
      setCategories(updatedCategories);
    }
    setIsEditingService(false);
  };

  // Handle selecting a category
  const handleSelectCategory = (categoryId) => {
    const category = categories.find((category) => category.id === categoryId);
    setSelectedCategory(category);
    setIsEditingCategory(false);
    setIsEditingService(false);
  };

  // Handle selecting a service
  const handleSelectService = (serviceId) => {
    const service = selectedCategory.services.find((service) => service.id === serviceId);
    setSelectedService(service);
    setIsEditingService(true);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold">Admin Services</h1>

      {/* Category Management */}
      <section className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Categories</h2>
        <CategoryList categories={categories} onDelete={handleDeleteCategory} onEdit={handleSelectCategory} />
        {isEditingCategory ? (
          <CategoryForm
            initialData={selectedCategory || {}}
            onSubmit={handleCategorySubmit}
          />
        ) : (
          <button
            onClick={() => setIsEditingCategory(true)}
            className="mt-4 p-2 bg-blue-500 text-white rounded"
          >
            Add New Category
          </button>
        )}
      </section>

      {/* Service Management (when a category is selected) */}
      {selectedCategory && (
        <section className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Services for {selectedCategory.title}</h2>
          <ServiceList
            services={selectedCategory.services}
            onDelete={(serviceId) => {
              const updatedCategory = {
                ...selectedCategory,
                services: selectedCategory.services.filter((service) => service.id !== serviceId),
              };
              setCategories(
                categories.map((category) =>
                  category.id === selectedCategory.id ? updatedCategory : category
                )
              );
            }}
            onEdit={handleSelectService}
          />
          {isEditingService ? (
            <ServiceForm
              initialData={selectedService || {}}
              onSubmit={handleServiceSubmit}
            />
          ) : (
            <button
              onClick={() => setIsEditingService(true)}
              className="mt-4 p-2 bg-green-500 text-white rounded"
            >
              Add New Service
            </button>
          )}
        </section>
      )}
    </div>
  );
};

export default AdminServices;
