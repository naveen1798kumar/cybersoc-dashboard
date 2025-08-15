import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const API_BASE = '/api';

const AdminServices = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [services, setServices] = useState([]);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [categoryFormData, setCategoryFormData] = useState(null);
  const navigate = useNavigate();

  // Fetch categories
  useEffect(() => {
    let mounted = true;
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${API_BASE}/categories`);
        const data = Array.isArray(res.data) ? res.data : res.data.categories || [];
        if (mounted) setCategories(data);
      } catch (err) {
        console.error('Failed to load categories', err);
        toast.error('Failed to load categories');
      }
    };
    fetchCategories();
    return () => { mounted = false; };
  }, []);

  // Fetch services when selectedCategory changes
  useEffect(() => {
    let cancelled = false;
    const fetchServices = async () => {
      try {
        const res = await axios.get(`${API_BASE}/services`);
        if (!cancelled) {
          let allServices = Array.isArray(res.data) ? res.data : [];
          if (selectedCategory) {
            allServices = allServices.filter(
              srv => srv.category?._id === selectedCategory._id
            );
          }
          setServices(allServices);
        }
      } catch (err) {
        console.error('Failed to fetch services', err);
        if (!cancelled) setServices([]);
        toast.error('Failed to load services');
      }
    };
    fetchServices();
    return () => { cancelled = true; };
  }, [selectedCategory]);

  // Category actions
  const handleAddCategory = async (data) => {
    try {
      const res = await axios.post(`${API_BASE}/categories`, data);
      setCategories(prev => [...prev, res.data]);
      setShowCategoryForm(false);
      setCategoryFormData(null);
      toast.success('Category added!');
    } catch (err) {
      console.error('Add category failed', err);
      toast.error('Failed to add category');
    }
  };

  const handleEditCategory = async (id, data) => {
    try {
      const res = await axios.put(`${API_BASE}/categories/${id}`, data);
      setCategories(prev => prev.map(cat => cat._id === id ? res.data : cat));
      if (selectedCategory && selectedCategory._id === id) {
        setSelectedCategory(res.data);
      }
      setShowCategoryForm(false);
      setCategoryFormData(null);
      toast.success('Category updated!');
    } catch (err) {
      console.error('Edit category failed', err);
      toast.error('Failed to update category');
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Delete this category?')) return;
    try {
      await axios.delete(`${API_BASE}/categories/${id}`);
      setCategories(prev => prev.filter(cat => cat._id !== id));
      if (selectedCategory && selectedCategory._id === id) {
        setSelectedCategory(null);
        setServices([]);
      }
      toast.success('Category deleted!');
    } catch (err) {
      console.error('Delete category failed', err);
      toast.error('Failed to delete category');
    }
  };

  const handleDeleteService = async (id) => {
    if (!window.confirm('Delete this service?')) return;
    try {
      await axios.delete(`${API_BASE}/services/${id}`);
      setServices(prev => prev.filter(srv => srv._id !== id));
      toast.success('Service deleted!');
    } catch (err) {
      console.error('Delete service failed', err);
      toast.error('Failed to delete service');
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Service Categories & Services</h1>

      {/* Categories Section */}
      <section className="mb-10">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-semibold">Service Categories</h2>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition"
            onClick={() => { setShowCategoryForm(true); setCategoryFormData(null); }}
          >
            + Add Category
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
          {categories.map(cat => (
            <div
              key={cat._id}
              className={`bg-white p-4 rounded-lg shadow border hover:shadow-lg transition cursor-pointer ${selectedCategory && selectedCategory._id === cat._id ? 'ring-2 ring-blue-500' : ''}`}
              onClick={() => { setSelectedCategory(cat); }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter') { setSelectedCategory(cat); } }}
            >
              {cat.image && (
                <img src={cat.image} alt={cat.title} className="w-full h-40 object-cover rounded mb-3" />
              )}
              <h3 className="text-lg font-semibold text-blue-800">{cat.title}</h3>
              <p className="text-sm text-gray-600">{cat.description?.slice(0, 80)}{cat.description?.length > 80 ? '...' : ''}</p>
              <div className="flex justify-end mt-3 gap-2">
                <button
                  className="text-blue-600 hover:underline"
                  onClick={e => {
                    e.stopPropagation();
                    setShowCategoryForm(true);
                    setCategoryFormData(cat);
                  }}
                >Edit</button>
                <button
                  className="text-red-600 hover:underline"
                  onClick={e => {
                    e.stopPropagation();
                    handleDeleteCategory(cat._id);
                  }}
                >Delete</button>
              </div>
            </div>
          ))}
        </div>

        {/* Category Modal */}
        {showCategoryForm && (
          <CategoryModal
            initialData={categoryFormData}
            onSubmit={categoryFormData ? (data) => handleEditCategory(categoryFormData._id, data) : handleAddCategory}
            onClose={() => { setShowCategoryForm(false); setCategoryFormData(null); }}
          />
        )}
      </section>

      {/* Services Section */}
      {selectedCategory ? (
        <section>
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-semibold">
              Services in: <span className="text-blue-700">{selectedCategory.title}</span>
            </h2>
            <button
              className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700 transition"
              onClick={() => navigate(`/dashboard/services/add?category=${selectedCategory._id}`)}
            >
              + Add Service
            </button>
          </div>

          <ul className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            {services.map((srv) => (
              <li
                key={srv._id}
                className="flex items-start gap-4 p-4 bg-white rounded-lg shadow hover:shadow-lg transition relative"
              >
                {srv.image && (
                  <img
                    src={srv.image}
                    alt={srv.title}
                    className="w-20 h-20 object-cover rounded border"
                  />
                )}
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-green-700">
                    <Link to={`/dashboard/services/${srv._id}`} className="hover:underline">
                      {srv.title}
                    </Link>
                  </h3>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">{srv.description}</p>
                  <div className="flex gap-4 mt-2">
                    <button
                      className="text-blue-600 text-sm hover:underline"
                      onClick={() => navigate(`/dashboard/services/${srv._id}/edit`)}
                    >
                      Edit
                    </button>
                    <button
                      className="text-red-600 text-sm hover:underline"
                      onClick={() => handleDeleteService(srv._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>
      ) : (
        <div className="text-gray-500 text-center mt-8">
          <p>Please select or create a category to manage its services.</p>
        </div>
      )}
    </div>
  );
};

// Category modal remains the same
function CategoryModal({ initialData = {}, onSubmit, onClose }) {
  const safeData = initialData || {};
  const [form, setForm] = useState({
    title: safeData.title || '',
    description: safeData.description || '',
    image: safeData.image || '',
  });
  const [uploading, setUploading] = useState(false);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("image", file);
    formData.append("fileName", file.name);
    try {
      const res = await fetch('/api/upload/image/service', {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.url) {
        setForm(prev => ({ ...prev, image: data.url }));
      } else {
        toast.error("Image upload failed");
      }
    } catch (err) {
      toast.error("ImageKit upload error");
    }
    setUploading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <form
        className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md space-y-4 relative"
        onSubmit={e => { e.preventDefault(); onSubmit(form); }}
      >
        <button
          type="button"
          className="absolute top-2 right-2 text-gray-400 hover:text-red-500 text-2xl"
          onClick={onClose}
        >×</button>
        <h2 className="text-xl font-bold mb-2">{initialData && initialData._id ? "Edit" : "Add"} Category</h2>
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Category Title"
          className="w-full border px-3 py-2 rounded"
          required
        />
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          className="w-full border px-3 py-2 rounded"
        />
        <div>
          <label className="font-semibold">Upload Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="block mb-2"
          />
          {uploading && <p className="text-blue-500">Uploading...</p>}
          {form.image && <img src={form.image} alt="Preview" className="h-24 mt-2 rounded shadow" />}
        </div>
        <div className="flex gap-2 justify-end">
          <button type="button" onClick={onClose} className="px-4 py-2 border rounded">Cancel</button>
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Save</button>
        </div>
      </form>
    </div>
  );
}

export default AdminServices;
