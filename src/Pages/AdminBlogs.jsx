import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios.js';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

const truncate = (str, n) => (str && str.length > n ? str.slice(0, n) + '...' : str);

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
          <article
            key={blog._id}
            className="transition-transform duration-300 hover:scale-[1.03] group"
          >
            <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">
              <div className="relative aspect-[16/9] overflow-hidden">
                <img
                  src={blog.image || '/placeholder.jpg'}
                  alt={blog.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <span className="absolute top-3 left-3 bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow">
                  {blog.category}
                </span>
              </div>
              <div className="p-5 space-y-2">
                <h2 className="text-lg font-bold text-gray-900 leading-snug line-clamp-2">
                  {truncate(blog.title, 50)}
                </h2>
                <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                  {truncate(blog.summary, 120)}
                </p>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-gray-500">
                    {blog.date} {blog.author && `by ${blog.author}`}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate(`/dashboard/blogs/edit/${blog._id}`)}
                      className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                      title="Edit"
                    >
                      <FaEdit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(blog._id)}
                      className="p-2 bg-red-500 text-white rounded hover:bg-red-600"
                      title="Delete"
                    >
                      <FaTrash size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </article>
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
