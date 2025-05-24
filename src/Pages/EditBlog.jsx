import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';

const EditBlog = ({ isNew }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(isNew ? {
    title: '',
    summary: '',
    content: '',
    image: '',
    author: '',
    category: '',
    style: {},
  } : null);

  useEffect(() => {
    if (!isNew) {
      // Fetch the blog from the API using the id
      api.get(`/blogs/${id}`)
        .then(res => {
          if (res.data) {
            setBlog(res.data);
          } else {
            alert('Blog not found');
            navigate('/dashboard/blogs');
          }
        })
        .catch(() => {
          alert('Blog not found');
          navigate('/dashboard/blogs');
        });
    }
  }, [id, isNew, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBlog((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  if (isNew) {
    try {
      const blogToSend = {
        title: blog.title,
        summary: blog.summary,
        content: blog.content,
        image: blog.image,
        author: blog.author,
        category: blog.category,
        // date: blog.date, // optional
        style: blog.style || {},
      };
      console.log('Submitting blog:', blogToSend);
      await api.post('/blogs', blogToSend);
      navigate('/dashboard/blogs');
    } catch (error) {
      alert('Failed to add blog: ' + (error.response?.data?.message || error.message));
      console.error(error.response?.data || error);
    }
  } else {
        try {
      const blogToSend = {
        title: blog.title,
        summary: blog.summary,
        content: blog.content,
        image: blog.image,
        author: blog.author,
        category: blog.category,
        style: blog.style || {},
      };
      await api.put(`/blogs/${blog._id}`, blogToSend);
      navigate('/dashboard/blogs');
    } catch (error) {
      alert('Failed to update blog: ' + (error.response?.data?.message || error.message));
      console.error(error.response?.data || error);
    }
    // Update logic
    console.log('Updated blog:', blog);
  }
};

  if (!blog) return null;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">
        {isNew ? 'Add New Blog' : `Edit Blog: ${blog.title}`}
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl mx-auto">
        <input
          type="text"
          name="title"
          value={blog.title}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded"
          placeholder="Title"
        />
        <input
          type="text"
          name="slug"
          value={blog.slug}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded"
          placeholder="Slug"
        />
        <textarea
          name="summary"
          value={blog.summary}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded"
          placeholder="Summary"
        />
        <input
          type="text"
          name="date"
          value={blog.date}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded"
          placeholder="Date"
        />
        <input
          type="text"
          name="author"
          value={blog.author}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded"
          placeholder="Author"
        />
        <input
          type="text"
          name="category"
          value={blog.category}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded"
          placeholder="Category"
        />
        <input
          type="text"
          name="image"
          value={blog.image}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded"
          placeholder="Image URL or import"
        />
        <textarea
          name="content"
          value={blog.content}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded"
          placeholder="Content"
          rows={6}
        />
        {/* Optionally, add fields for lists if needed */}
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => navigate('/dashboard/blogs')}
            className="px-4 py-2 rounded border"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            {isNew ? 'Add Blog' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditBlog;