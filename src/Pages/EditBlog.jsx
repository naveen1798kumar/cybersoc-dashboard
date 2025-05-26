import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';

const emptyLists = {
  whyImportant: [],
  types: [],
  pros: [],
  cons: [],
  useCases: [],
  bestPractices: [],
  tools: [],
};

const EditBlog = ({ isNew }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(isNew ? {
    title: '',
    slug: '',
    summary: '',
    date: '',
    author: '',
    category: '',
    image: '',
    content: '',
    lists: { ...emptyLists },
  } : null);

  useEffect(() => {
    if (!isNew) {
      // Fetch the blog from the API using the id
      api.get(`/blogs/${id}`)
        .then(res => {
          if (res.data) {
            setBlog({
              ...res.data,
              lists: { ...emptyLists, ...res.data.lists }, // ensure all lists keys exist
            });
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

  // For handling lists fields (comma-separated input)
  const handleListChange = (e) => {
    const { name, value } = e.target;
    setBlog((prev) => ({
      ...prev,
      lists: {
        ...prev.lists,
        [name]: value.split(',').map((item) => item.trim()).filter(Boolean),
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const blogToSend = {
      title: blog.title,
      slug: blog.slug,
      summary: blog.summary,
      date: blog.date,
      author: blog.author,
      category: blog.category,
      image: blog.image,
      content: blog.content,
      lists: blog.lists,
    };
    try {
      if (isNew) {
        await api.post('/blogs', blogToSend);
      } else {
        await api.put(`/blogs/${blog._id}`, blogToSend);
      }
      navigate('/dashboard/blogs');
    } catch (error) {
      alert('Failed to save blog: ' + (error.response?.data?.message || error.message));
      console.error(error.response?.data || error);
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

        {/* Lists fields as comma-separated values */}
        <div>
          <label className="block font-semibold">Why Important (comma separated)</label>
          <input
            type="text"
            name="whyImportant"
            value={blog.lists.whyImportant.join(', ')}
            onChange={handleListChange}
            className="w-full border px-4 py-2 rounded"
          />
        </div>
        <div>
          <label className="block font-semibold">Types (comma separated)</label>
          <input
            type="text"
            name="types"
            value={blog.lists.types.join(', ')}
            onChange={handleListChange}
            className="w-full border px-4 py-2 rounded"
          />
        </div>
        <div>
          <label className="block font-semibold">Pros (comma separated)</label>
          <input
            type="text"
            name="pros"
            value={blog.lists.pros.join(', ')}
            onChange={handleListChange}
            className="w-full border px-4 py-2 rounded"
          />
        </div>
        <div>
          <label className="block font-semibold">Cons (comma separated)</label>
          <input
            type="text"
            name="cons"
            value={blog.lists.cons.join(', ')}
            onChange={handleListChange}
            className="w-full border px-4 py-2 rounded"
          />
        </div>
        <div>
          <label className="block font-semibold">Use Cases (comma separated)</label>
          <input
            type="text"
            name="useCases"
            value={blog.lists.useCases.join(', ')}
            onChange={handleListChange}
            className="w-full border px-4 py-2 rounded"
          />
        </div>
        <div>
          <label className="block font-semibold">Best Practices (comma separated)</label>
          <input
            type="text"
            name="bestPractices"
            value={blog.lists.bestPractices.join(', ')}
            onChange={handleListChange}
            className="w-full border px-4 py-2 rounded"
          />
        </div>
        <div>
          <label className="block font-semibold">Tools (comma separated)</label>
          <input
            type="text"
            name="tools"
            value={blog.lists.tools.join(', ')}
            onChange={handleListChange}
            className="w-full border px-4 py-2 rounded"
          />
        </div>

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