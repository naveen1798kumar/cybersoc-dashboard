// src/pages/EditServicePage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EditServicePage = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({});
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    axios.get(`/api/services/${serviceId}`)
      .then(res => {
        setService(res.data);
        setForm(res.data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        alert("Failed to load service");
      });
  }, [serviceId]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('image', file);
    formData.append('fileName', file.name);
    try {
      const res = await fetch('/api/upload/service', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.url) {
        setForm(prev => ({ ...prev, image: data.url }));
      }
    } catch (err) {
      alert("Image upload failed");
    }
    setUploading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/services/${serviceId}`, form);
      alert("Service updated successfully!");
      navigate('/dashboard/services');
    } catch (err) {
      alert("Failed to update service");
    }
  };

  if (loading) return <div className="p-6 text-center">Loading...</div>;
  if (!service) return <div className="p-6 text-center text-red-500">Service not found</div>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Edit Service: {service.title}</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="title"
          value={form.title || ''}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          placeholder="Service Title"
          required
        />
        <textarea
          name="description"
          value={form.description || ''}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          placeholder="Service Description"
          rows={4}
        />
        <div>
          <label className="block mb-1 font-medium">Upload Image</label>
          <input type="file" accept="image/*" onChange={handleImageUpload} />
          {uploading && <p className="text-sm text-blue-600 mt-1">Uploading...</p>}
          {form.image && <img src={form.image} alt="preview" className="mt-2 w-full max-w-sm rounded" />}
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditServicePage;
