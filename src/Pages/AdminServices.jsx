import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const API_BASE = '/api';

const AdminServices = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showServiceForm, setShowServiceForm] = useState(false);

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
  };

  const handleEditCategory = async (id, data) => {
    const res = await axios.put(`${API_BASE}/categories/${id}`, data);
    setCategories(categories.map(cat => cat._id === id ? res.data : cat));
    setShowCategoryForm(false);
  };

  const handleDeleteCategory = async (id) => {
    if (window.confirm('Delete this category?')) {
      await axios.delete(`${API_BASE}/categories/${id}`);
      setCategories(categories.filter(cat => cat._id !== id));
      setSelectedCategory(null);
      setServices([]);
    }
  };

  const handleAddService = async (data) => {
    const res = await axios.post(`${API_BASE}/services`, { ...data, category: selectedCategory._id });
    setServices([...services, res.data]);
    setShowServiceForm(false);
  };

  const handleEditService = async (id, data) => {
    const res = await axios.put(`${API_BASE}/services/${id}`, data);
    setServices(services.map(srv => srv._id === id ? res.data : srv));
    setShowServiceForm(false);
  };

  const handleDeleteService = async (id) => {
    if (window.confirm('Delete this service?')) {
      await axios.delete(`${API_BASE}/services/${id}`);
      setServices(services.filter(srv => srv._id !== id));
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Admin: Service Categories & Services</h1>

      <section className="mb-10">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-semibold">Service Categories</h2>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded"
            onClick={() => { setShowCategoryForm(true); setSelectedCategory(null); }}
          >
            Add Category
          </button>
        </div>
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
  {Array.isArray(categories) && categories.map(cat => (
    <div
      key={cat._id}
      className={`bg-white p-4 rounded-lg shadow border hover:shadow-md transition cursor-pointer ${
        selectedCategory && selectedCategory._id === cat._id ? 'ring-2 ring-blue-500' : ''
      }`}
      onClick={() => { setSelectedCategory(cat); setShowServiceForm(false); setSelectedService(null); }}
    >
      {/* {cat.image && (
        <img src={cat.image} alt={cat.title} className="w-full h-40 object-cover rounded mb-3" />
      )} */}
      <h3 className="text-lg font-semibold text-blue-800">{cat.title}</h3>
      <p className="text-sm text-gray-600">{cat.description?.slice(0, 80)}...</p>
      <div className="flex justify-end mt-3 gap-2">
        <button
          className="text-blue-600"
          onClick={(e) => { e.stopPropagation(); setShowCategoryForm(true); setSelectedCategory(cat); }}
        >Edit</button>
        <button
          className="text-red-600"
          onClick={(e) => { e.stopPropagation(); handleDeleteCategory(cat._id); }}
        >Delete</button>
      </div>
    </div>
  ))}
</div>

        {showCategoryForm && (
          <CategoryForm
            initialData={selectedCategory}
            onSubmit={selectedCategory ? (data) => handleEditCategory(selectedCategory._id, data) : handleAddCategory}
            onCancel={() => setShowCategoryForm(false)}
          />
        )}
      </section>

      {selectedCategory ? (
        <section>
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-semibold">
              Services in: <span className="text-blue-700">{selectedCategory.title}</span>
            </h2>
            <button
              className="bg-green-600 text-white px-4 py-2 rounded"
              onClick={() => { setShowServiceForm(true); setSelectedService(null); }}
            >
              Add Service
            </button>
          </div>
<ul className="space-y-4 mt-4">
  {services.map((srv) => (
    <li
      key={srv._id}
      className={`flex items-start gap-4 p-4 bg-white rounded-lg shadow hover:shadow-md transition relative ${
        selectedService && selectedService._id === srv._id ? 'ring-2 ring-green-500' : ''
      }`}
      onClick={() => { setSelectedService(srv); setShowServiceForm(false); }}
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
            className="text-blue-600 text-sm"
            onClick={(e) => {
              e.stopPropagation();
              setShowServiceForm(true);
              setSelectedService(srv);
            }}
          >
            Edit
          </button>
          <button
            className="text-red-600 text-sm"
            onClick={(e) => {
              e.stopPropagation();
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

          
          {showServiceForm && (
            <ServiceForm
              initialData={selectedService}
              onSubmit={selectedService ? (data) => handleEditService(selectedService._id, data) : handleAddService}
              onCancel={() => setShowServiceForm(false)}
              uploadEndpoint="/api/upload/service"
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

// --- Category Form ---
function CategoryForm({ initialData = {}, onSubmit, onCancel }) {
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
    // formData.append("publicKey", "public_u/u4AIvv/bZDMQSMQElbtxOFIkw="); // Replace with your key
    // formData.append("uploadPreset", "default"); // Optional if your account requires it

    try {
      const res = await fetch('/api/upload/image/service', {
        method: "POST",
        // headers: {
        //   Authorization: "Basic " + btoa("your_imagekit_private_api_key:"), // Replace with your ImageKit private key
        // },
        body: formData,
      });
      const data = await res.json();
      if (data.url) {
        setForm(prev => ({ ...prev, image: data.url }));
      } else {
        alert("Image upload failed");
      }
    } catch (err) {
      console.error(err);
      alert("ImageKit upload error");
    }

    setUploading(false);
  };


  return (
    <form
      className="bg-gray-50 p-4 rounded mt-4 mb-6 space-y-3"
      onSubmit={e => { e.preventDefault(); onSubmit(form); }}
    >
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
        <button type="button" onClick={onCancel} className="px-4 py-2 border rounded">Cancel</button>
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Save</button>
      </div>
    </form>
  );
}

// --- Service Form with dynamic fields ---
function ServiceForm({ initialData, onSubmit, onCancel }) {
  const data = initialData || {};
  const [form, setForm] = useState({
    title: data.title || '',
    description: data.description || '',
    image: data.image || '',
    sections: data.sections || [],
    benefits: data.benefits || [],
    features: data.features || [],
    faqs: data.faqs || [],
  });
  const [uploading, setUploading] = useState(false);

  // Handlers for dynamic arrays
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

const handleImageUpload = async (e) => {
  const file = e.target.files[0];
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
    if (data.url) {
      setForm(prev => ({ ...prev, image: data.url }));
    } else {
      alert("Image upload failed");
    }
  } catch (err) {
    alert("Upload error");
  }
  setUploading(false);
};


  return (
    <form
      className="bg-gray-50 p-4 rounded mt-4 mb-6 space-y-3"
      onSubmit={e => { e.preventDefault(); onSubmit(form); }}
    >
      <input
        name="title"
        value={form.title}
        onChange={handleChange}
        placeholder="Service Title"
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
      {/* <input
        name="image"
        value={form.image}
        onChange={handleChange}
        placeholder="Image URL"
        className="w-full border px-3 py-2 rounded"
      /> */}
      {form.image && (
        <img src={form.image} alt="Preview" className="h-24 mt-2 rounded shadow" />
      )}
      <div>
        <label className="font-semibold">Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="block mb-2"
        />
        {uploading && <span className="text-blue-600">Uploading...</span>}
        {form.image && (
          <img src={form.image} alt="Preview" className="h-24 mt-2 rounded shadow" />
        )}
      </div>

      {/* Sections */}
      <div>
        <label className="font-semibold">Sections</label>
        {form.sections.map((section, idx) => (
          <div key={idx} className="flex gap-2 mb-2">
            <input
              value={section.title}
              onChange={e => handleArrayChange('sections', idx, 'title', e.target.value)}
              placeholder="Section Title"
              className="border px-2 py-1 rounded w-1/3"
            />
            <input
              value={section.content}
              onChange={e => handleArrayChange('sections', idx, 'content', e.target.value)}
              placeholder="Section Content"
              className="border px-2 py-1 rounded w-2/3"
            />
            <button type="button" onClick={() => handleArrayRemove('sections', idx)} className="text-red-600">Remove</button>
          </div>
        ))}
        <button type="button" onClick={() => handleArrayAdd('sections', { title: '', content: '' })} className="text-blue-600">+ Add Section</button>
      </div>

      {/* Benefits */}
      <div>
        <label className="font-semibold">Benefits</label>
        {form.benefits.map((benefit, idx) => (
          <div key={idx} className="flex gap-2 mb-2">
            <input
              value={benefit}
              onChange={e => {
                const arr = [...form.benefits];
                arr[idx] = e.target.value;
                setForm(prev => ({ ...prev, benefits: arr }));
              }}
              placeholder="Benefit"
              className="border px-2 py-1 rounded w-5/6"
            />
            <button type="button" onClick={() => handleArrayRemove('benefits', idx)} className="text-red-600">Remove</button>
          </div>
        ))}
        <button type="button" onClick={() => handleArrayAdd('benefits', '')} className="text-blue-600">+ Add Benefit</button>
      </div>

      {/* Features */}
      <div>
        <label className="font-semibold">Features</label>
        {form.features.map((feature, idx) => (
          <div key={idx} className="flex gap-2 mb-2">
            <input
              value={feature.title}
              onChange={e => handleArrayChange('features', idx, 'title', e.target.value)}
              placeholder="Feature Title"
              className="border px-2 py-1 rounded w-1/3"
            />
            <input
              value={feature.description}
              onChange={e => handleArrayChange('features', idx, 'description', e.target.value)}
              placeholder="Feature Description"
              className="border px-2 py-1 rounded w-2/3"
            />
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
            <input
              value={faq.question}
              onChange={e => handleArrayChange('faqs', idx, 'question', e.target.value)}
              placeholder="FAQ Question"
              className="border px-2 py-1 rounded w-1/2"
            />
            <input
              value={faq.answer}
              onChange={e => handleArrayChange('faqs', idx, 'answer', e.target.value)}
              placeholder="FAQ Answer"
              className="border px-2 py-1 rounded w-1/2"
            />
            <button type="button" onClick={() => handleArrayRemove('faqs', idx)} className="text-red-600">Remove</button>
          </div>
        ))}
        <button type="button" onClick={() => handleArrayAdd('faqs', { question: '', answer: '' })} className="text-blue-600">+ Add FAQ</button>
      </div>

      <div className="flex gap-2 justify-end mt-4">
        <button type="button" onClick={onCancel} className="px-4 py-2 border rounded">Cancel</button>
        <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded">Save</button>
      </div>
    </form>
  );
}

export default AdminServices;