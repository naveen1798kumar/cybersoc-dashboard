import React from 'react';
import { assets } from '../assets/assets/assets/assets';
import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const BlogTableItem = ({ blog, index, fetchBlogs }) => {
  const { title, createdAt } = blog;
  const { axios } = useAppContext();
  const navigate = useNavigate();

  const BlogDate = new Date(createdAt);

  const deleteBlog = async () => {
    const confirmDelete = window.confirm('Are you sure you want to delete this blog?');
    if (!confirmDelete) return;

    try {
      const { data } = await axios.delete(`/blogs/${blog._id}`);
      if (data.success) {
        toast.success(data.message);
        await fetchBlogs();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error('Error deleting blog');
    }
  };

  const togglePublish = async () => {
    try {
      const { data } = await axios.post('/blogs/toggle-publish', { id: blog._id });
      if (data.success) {
        toast.success(data.message);
        await fetchBlogs();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error('Error updating publish status');
    }
  };

  return (
<tr className="border-b hover:bg-gray-50 transition duration-200">
  <td className="px-6 py-4 italic">{index}</td>

  <td className="px-6 py-4">
    <button
      onClick={() => navigate(`${blog._id}`)}
      className="text-blue-600 font-medium hover:text-blue-800 hover:underline cursor-pointer"
    >
      {title}
    </button>
  </td>

  <td className="px-6 py-4">{BlogDate.toDateString()}</td>

  <td className="px-6 py-4">
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium ${
        blog.isPublished ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
      }`}
    >
      {blog.isPublished ? 'Published' : 'Unpublished'}
    </span>
  </td>

  <td className="px-6 py-4 flex gap-3 items-center flex-wrap">
    <button
      onClick={togglePublish}
      className={`text-xs px-3 py-1 rounded-full border ${
        blog.isPublished
          ? 'bg-white text-orange-600 border-orange-400 hover:bg-orange-100'
          : 'bg-white text-green-600 border-green-400 hover:bg-green-100'
      } transition`}
    >
      {blog.isPublished ? 'Unpublish' : 'Publish'}
    </button>

    <button
      onClick={() => navigate(`/dashboard/blogs/edit/${blog._id}`)}
      className="text-xs px-3 py-1 rounded-full bg-blue-100 text-blue-800 hover:bg-blue-200 transition"
    >
      Edit
    </button>

    <img
      src={assets.cross_icon}
      alt="Delete"
      title="Delete Blog"
      className="w-5 cursor-pointer hover:scale-110 transition"
      onClick={deleteBlog}
    />
  </td>
</tr>

  );
};

export default BlogTableItem;
