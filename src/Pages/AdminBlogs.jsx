import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios.js'; // Updated path for Axios instance
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

const AdminBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [editingBlog, setEditingBlog] = useState(null);
  const navigate = useNavigate();

  // Fetch blogs from API
  const fetchBlogs = async () => {
    try {
      const { data } = await api.get('/blogs');
      setBlogs(data);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      try {
        await api.delete(`/blogs/${id}`);
        setBlogs((prev) => prev.filter((blog) => blog._id !== id));
      } catch (error) {
        console.error('Error deleting blog:', error);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditingBlog((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.put(`/blogs/${editingBlog._id}`, editingBlog);
      setBlogs((prev) =>
        prev.map((blog) => (blog._id === editingBlog._id ? data : blog))
      );
      setEditingBlog(null);
    } catch (error) {
      console.error('Error updating blog:', error);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Blogs</h1>
        <button
          onClick={() => navigate('/dashboard/blogs/add')}
          className="flex items-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          <FaPlus className="mr-2" />
          Add Blog
        </button>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.map((blog) => (
          <div key={blog._id} className="bg-white p-4 rounded shadow">
            <img src={blog.image || null} alt={blog.title} className="h-40 w-full object-cover rounded" />
            <h2 className="text-xl font-semibold mt-2">{blog.title}</h2>
            <p className="text-sm text-gray-500">{blog.date} by {blog.author}</p>
            <p className="text-gray-600 mt-1">{blog.summary}</p>
            <div className="flex justify-end mt-4 space-x-2">
              <button
                onClick={() => navigate(`/dashboard/blogs/edit/${blog._id}`)}
                className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                <FaEdit size={16} />
              </button>
              <button
                onClick={() => handleDelete(blog._id)}
                className="p-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                <FaTrash size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {editingBlog && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded w-full max-w-lg relative">
            <h2 className="text-xl font-bold mb-4">Edit Blog</h2>
            <form onSubmit={handleUpdate} className="space-y-4">
              <input
                type="text"
                name="title"
                value={editingBlog.title}
                onChange={handleChange}
                className="w-full border px-4 py-2 rounded"
                placeholder="Title"
              />
              <textarea
                name="summary"
                value={editingBlog.summary}
                onChange={handleChange}
                className="w-full border px-4 py-2 rounded"
                placeholder="Summary"
              />
              <input
                type="text"
                name="author"
                value={editingBlog.author}
                onChange={handleChange}
                className="w-full border px-4 py-2 rounded"
                placeholder="Author"
              />
              <input
                type="text"
                name="category"
                value={editingBlog.category}
                onChange={handleChange}
                className="w-full border px-4 py-2 rounded"
                placeholder="Category"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingBlog(null)}
                  className="px-4 py-2 rounded border"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBlogs;
