import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const API_BASE = '/api';

const AdminServices = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [categoryFormData, setCategoryFormData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${API_BASE}/categories`).then(res => {
      setCategories(Array.isArray(res.data) ? res.data : res.data.categories || []);
    });
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      axios.get(`${API_BASE}/services?category=${selectedCategory._id}`)
        .then(res => setServices(res.data));
    } else {
      setServices([]);
    }
  }, [selectedCategory]);

  const handleAddCategory = async (data) => {
    const res = await axios.post(`${API_BASE}/categories`, data);
    setCategories([...categories, res.data]);
    setShowCategoryForm(false);
    setCategoryFormData(null);
    toast.success("Category added!");
  };

  const handleEditCategory = async (id, data) => {
    const res = await axios.put(`${API_BASE}/categories/${id}`, data);
    setCategories(categories.map(cat => cat._id === id ? res.data : cat));
    setShowCategoryForm(false);
    setCategoryFormData(null);
    toast.success("Category updated!");
  };

  const handleDeleteCategory = async (id) => {
    if (window.confirm('Delete this category?')) {
      await axios.delete(`${API_BASE}/categories/${id}`);
      setCategories(categories.filter(cat => cat._id !== id));
      setSelectedCategory(null);
      setServices([]);
      toast.success("Category deleted!");
    }
  };

  const handleAddService = async (data) => {
    try {
      const res = await axios.post(`${API_BASE}/services`, { ...data, category: selectedCategory._id });
      setServices([...services, res.data]);
      setShowServiceForm(false);
      setSelectedService(null);
      toast.success("Service added!");
    } catch {
      toast.error("Failed to add service");
    }
  };

  const handleEditService = async (id, data) => {
    const res = await axios.put(`${API_BASE}/services/${id}`, data);
    setServices(services.map(srv => srv._id === id ? res.data : srv));
    setShowServiceForm(false);
    setSelectedService(null);
    toast.success("Service updated!");
  };

  const handleDeleteService = async (id) => {
    if (window.confirm('Delete this service?')) {
      await axios.delete(`${API_BASE}/services/${id}`);
      setServices(services.filter(srv => srv._id !== id));
      toast.success("Service deleted!");
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
              className={`bg-white p-4 rounded-lg shadow border hover:shadow-lg transition cursor-pointer ${
                selectedCategory && selectedCategory._id === cat._id ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => { setSelectedCategory(cat); setShowServiceForm(false); setSelectedService(null); }}
            >
              {cat.image && (
                <img src={cat.image} alt={cat.title} className="w-full h-40 object-cover rounded mb-3" />
              )}
              <h3 className="text-lg font-semibold text-blue-800">{cat.title}</h3>
              <p className="text-sm text-gray-600">{cat.description?.slice(0, 80)}...</p>
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
              onClick={() => { setShowServiceForm(true); setSelectedService(null); }}
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
                      onClick={() => {
                        setShowServiceForm(true);
                        setSelectedService(srv);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="text-red-600 text-sm hover:underline"
                      onClick={async () => {
                        handleDeleteService(srv._id);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          {/* Service Modal */}
          {showServiceForm && (
            <ServiceModal
              initialData={selectedService}
              onSubmit={selectedService ? (data) => handleEditService(selectedService._id, data) : handleAddService}
              onClose={() => { setShowServiceForm(false); setSelectedService(null); }}
            />
          )}
        </section>
      ) : (
        <div className="text-gray-500 text-center mt-8">
          <p>Please select or create a category to manage its services.</p>
        </div>
      )}
    </div>
  );
};

// --- Category Modal (modern modal style, all fields) ---
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

// --- Service Modal with structured layout ---
function ServiceModal({ initialData, onSubmit, onClose }) {
  const data = initialData || {};
  const [form, setForm] = useState({
    title: data.title || '',
    description: data.description || '',
    bannerImage: data.bannerImage || '',
    sections: data.sections || [],
    benefits: data.benefits || [],
    benefitsImage: data.benefitsImage || '',
    features: data.features || [],
    faqs: data.faqs || [],
    faqImage: data.faqImage || '',
  });
  const [uploading, setUploading] = useState(false);

  const handleArrayChange = (field, idx, key, value) => {
    setForm(prev => {
      const arr = [...prev[field]];
      arr[idx][key] = value;
      return { ...prev, [field]: arr };
    });
  };

  const handleArrayAdd = (field, emptyObj) => {
    setForm(prev => ({ ...prev, [field]: [...prev[field], emptyObj] }));
  };

  const handleArrayRemove = (field, idx) => {
    setForm(prev => {
      const arr = [...prev[field]];
      arr.splice(idx, 1);
      return { ...prev, [field]: arr };
    });
  };

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleUpload = async (cb) => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.onchange = async () => {
      const file = fileInput.files[0];
      if (!file) return;
      setUploading(true);
      const formData = new FormData();
      formData.append('image', file);
      formData.append('fileName', file.name);
      try {
        const res = await fetch('/api/upload/image/service', {
          method: 'POST',
          body: formData,
        });
        const data = await res.json();
        if (data.url) cb(data.url);
        else toast.error("Upload failed");
      } catch {
        toast.error("Upload error");
      }
      setUploading(false);
    };
    fileInput.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <form
        className="bg-white p-6 rounded-lg shadow-xl w-full max-w-4xl space-y-4 relative overflow-y-auto max-h-[90vh]"
        onSubmit={e => { e.preventDefault(); onSubmit(form); }}
      >
        <button type="button" onClick={onClose} className="absolute top-2 right-2 text-gray-400 hover:text-red-500 text-2xl">×</button>
        <h2 className="text-xl font-bold mb-2">{data._id ? "Edit" : "Add"} Service</h2>

        {/* Banner Image */}
        <div>
          <label className="font-semibold">Banner Image</label>
          <button type="button" onClick={() => handleUpload(url => setForm(f => ({ ...f, bannerImage: url })))} className="text-blue-600 ml-2">Upload</button>
          {uploading && <span className="ml-2 text-sm text-blue-500">Uploading...</span>}
          {form.bannerImage && <img src={form.bannerImage} alt="" className="h-24 mt-2 rounded shadow" />}
        </div>

        {/* Title & Description */}
        <input name="title" value={form.title} onChange={handleChange} placeholder="Service Title" className="w-full border px-3 py-2 rounded" required />
        <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" className="w-full border px-3 py-2 rounded" />

        {/* Sections */}
        <div>
          <label className="font-semibold">Details (Sections)</label>
          {form.sections.map((section, idx) => (
            <div key={idx} className="border-b pb-2 mb-2">
              <div className="flex gap-2">
                <input value={section.title} onChange={e => handleArrayChange('sections', idx, 'title', e.target.value)} placeholder="Title" className="w-1/3 border px-2 py-1 rounded" />
                <input value={section.content} onChange={e => handleArrayChange('sections', idx, 'content', e.target.value)} placeholder="Content" className="w-2/3 border px-2 py-1 rounded" />
              </div>
              <div className="flex items-center gap-2 mt-1">
                <button type="button" onClick={() => handleUpload(url => handleArrayChange('sections', idx, 'image', url))} className="text-blue-600">Upload Image</button>
                {section.image && <img src={section.image} alt="" className="h-16 rounded shadow" />}
                <button type="button" onClick={() => handleArrayRemove('sections', idx)} className="text-red-600 ml-auto">Remove</button>
              </div>
            </div>
          ))}
          <button type="button" onClick={() => handleArrayAdd('sections', { title: '', content: '', image: '' })} className="text-blue-600">+ Add Section</button>
        </div>

        {/* Benefits */}
        <div>
          <label className="font-semibold">Key Benefits</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              {form.benefits.map((benefit, idx) => (
                <div key={idx} className="flex gap-2 mb-2">
                  <input value={benefit} onChange={e => {
                    const arr = [...form.benefits];
                    arr[idx] = e.target.value;
                    setForm(prev => ({ ...prev, benefits: arr }));
                  }} placeholder="Benefit" className="border px-2 py-1 rounded w-full" />
                  <button type="button" onClick={() => handleArrayRemove('benefits', idx)} className="text-red-600">Remove</button>
                </div>
              ))}
              <button type="button" onClick={() => handleArrayAdd('benefits', '')} className="text-blue-600">+ Add Benefit</button>
            </div>
            <div>
              <label className="font-semibold">Benefits Image</label><br />
              <button type="button" onClick={() => handleUpload(url => setForm(f => ({ ...f, benefitsImage: url })))} className="text-blue-600">Upload</button>
              {form.benefitsImage && <img src={form.benefitsImage} alt="" className="h-24 mt-2 rounded shadow" />}
            </div>
          </div>
        </div>

        {/* Features */}
        <div>
          <label className="font-semibold">Features</label>
          {form.features.map((feature, idx) => (
            <div key={idx} className="flex gap-2 mb-2">
              <input value={feature.title} onChange={e => handleArrayChange('features', idx, 'title', e.target.value)} placeholder="Title" className="w-1/3 border px-2 py-1 rounded" />
              <input value={feature.description} onChange={e => handleArrayChange('features', idx, 'description', e.target.value)} placeholder="Description" className="w-2/3 border px-2 py-1 rounded" />
              <button type="button" onClick={() => handleArrayRemove('features', idx)} className="text-red-600">Remove</button>
            </div>
          ))}
          <button type="button" onClick={() => handleArrayAdd('features', { title: '', description: '' })} className="text-blue-600">+ Add Feature</button>
        </div>

        {/* FAQs */}
        <div>
          <label className="font-semibold">FAQs</label>
          {form.faqs.map((faq, idx) => (
            <div key={idx} className="flex gap-2 mb-2">
              <input value={faq.question} onChange={e => handleArrayChange('faqs', idx, 'question', e.target.value)} placeholder="Question" className="w-1/2 border px-2 py-1 rounded" />
              <input value={faq.answer} onChange={e => handleArrayChange('faqs', idx, 'answer', e.target.value)} placeholder="Answer" className="w-1/2 border px-2 py-1 rounded" />
              <button type="button" onClick={() => handleArrayRemove('faqs', idx)} className="text-red-600">Remove</button>
            </div>
          ))}
          <button type="button" onClick={() => handleArrayAdd('faqs', { question: '', answer: '' })} className="text-blue-600">+ Add FAQ</button>
        </div>
        <div className="mt-2">
          <label className="font-semibold">FAQ Section Image</label><br />
          <button type="button" onClick={() => handleUpload(url => setForm(f => ({ ...f, faqImage: url })))} className="text-blue-600">Upload</button>
          {form.faqImage && <img src={form.faqImage} alt="" className="h-24 mt-2 rounded shadow" />}
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button type="button" onClick={onClose} className="px-4 py-2 border rounded">Cancel</button>
          <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded">Save</button>
        </div>
      </form>
    </div>
  );
}



export default AdminServices;