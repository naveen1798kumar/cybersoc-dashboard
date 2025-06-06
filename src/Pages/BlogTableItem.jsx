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
      const { data } = await axios.post('/blogs/delete', { id: blog._id });
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
    <tr className="border-b text-sm text-gray-700">
      <td className="px-4 py-3">{index}</td>
      <td className="px-4 py-3">{title}</td>
      <td className="px-4 py-3">{BlogDate.toDateString()}</td>
      <td className="px-4 py-3">
        <span className={`${blog.isPublished ? 'text-green-600' : 'text-orange-600'}`}>
          {blog.isPublished ? 'Published' : 'Unpublished'}
        </span>
      </td>
      <td className="px-4 py-3 flex gap-3">
        <button
          onClick={togglePublish}
          className="text-xs border px-2 py-1 rounded hover:bg-gray-100"
        >
          {blog.isPublished ? 'Unpublish' : 'Publish'}
        </button>
        <button
          onClick={() => navigate(`/dashboard/blogs/edit/${blog._id}`)}
          className="text-xs border px-2 py-1 rounded hover:bg-blue-100"
        >
          Edit
        </button>
        <img
          src={assets.cross_icon}
          alt="Delete"
          className="w-6 cursor-pointer hover:scale-110"
          onClick={deleteBlog}
        />
      </td>
    </tr>
  );
};

export default BlogTableItem;
