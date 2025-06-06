import React, { useEffect, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import BlogTableItem from './BlogTableItem';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const AdminBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const { axios } = useAppContext();
  const navigate = useNavigate();

  const fetchBlogs = async () => {
    try {
      const { data } = await axios.get('/blogs/all');
      if (data.success) {
        setBlogs(data.blogs);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error('Error fetching blogs');
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <div className="flex-1 pt-5 px-5 sm:pt-12 sm:pl-16 bg-blue-50/50">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">All Blogs</h2>
        <button
          onClick={() => navigate('/dashboard/blogs/add')}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          + Add Blog
        </button>
      </div>

      <div className="relative max-w-6xl overflow-x-auto shadow rounded-lg scrollbar-hide bg-white">
        <table className="w-full text-sm text-gray-700">
          <thead className="text-xs text-gray-600 text-left uppercase border-b">
            <tr>
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3">Blog Title</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {blogs.map((blog, index) => (
              <BlogTableItem
                key={blog._id}
                index={index + 1}
                blog={blog}
                fetchBlogs={fetchBlogs}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminBlogs;
