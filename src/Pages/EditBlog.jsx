import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import ReactQuill from 'react-quill';
import DatePicker from 'react-datepicker';
import 'react-quill/dist/quill.snow.css';
import 'react-datepicker/dist/react-datepicker.css';

const quillModules = {
  toolbar: [
    [{ 'header': [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    ['blockquote', 'code-block'],
    ['link', 'image'],
    ['clean']
  ]
};
const quillFormats = [
  'header', 'bold', 'italic', 'underline', 'strike', 'list', 'bullet',
  'blockquote', 'code-block', 'link', 'image'
];

const EditBlog = ({ isNew }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState({
    title: '',
    slug: '',
    summary: '',
    date: new Date(),
    author: '',
    category: '',
    image: '',
    content: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(!isNew);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isNew) {
      setLoading(true);
      api.get(`/blogs/${id}`)
        .then(res => {
          if (res.data) setBlog({ ...res.data, date: new Date(res.data.date) });
          else {
            setError('Blog not found');
            navigate('/dashboard/blogs');
          }
        })
        .catch(() => {
          setError('Blog not found');
          navigate('/dashboard/blogs');
        })
        .finally(() => setLoading(false));
    }
  }, [id, isNew, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBlog((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleContentChange = (value) => {
    setBlog((prev) => ({
      ...prev,
      content: value,
    }));
  };

  const handleDateChange = (date) => {
    setBlog((prev) => ({
      ...prev,
      date,
    }));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    // Example: upload to backend or cloud and get URL
    // const url = await uploadImage(file);
    // setBlog((prev) => ({ ...prev, image: url }));
    // For now, just preview locally:
    setBlog((prev) => ({ ...prev, image: URL.createObjectURL(file) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!blog.title || !blog.slug || !blog.content) {
      setError('Title, slug, and content are required.');
      return;
    }
    try {
      // If you want to upload the image to your backend, do it here and set blog.image to the returned URL
      // Example: if (imageFile) { ...upload logic... }
      const blogToSend = { ...blog, date: blog.date.toISOString() };
      if (isNew) {
        await api.post('/blogs', blogToSend);
      } else {
        await api.put(`/blogs/${blog._id}`, blogToSend);
      }
      navigate('/dashboard/blogs');
    } catch (error) {
      setError('Failed to save blog: ' + (error.response?.data?.message || error.message));
      console.error(error.response?.data || error);
    }
  };

  if (loading) return <div className="p-6 text-center">Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">
        {isNew ? 'Add New Blog' : `Edit Blog: ${blog.title}`}
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl mx-auto">
        {error && <div className="text-red-600 font-semibold">{error}</div>}
        <input
          type="text"
          name="title"
          value={blog.title}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded"
          placeholder="Title"
          required
        />
        <input
          type="text"
          name="slug"
          value={blog.slug}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded"
          placeholder="Slug (unique, for URL)"
          required
        />
        <textarea
          name="summary"
          value={blog.summary}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded"
          placeholder="Short summary (optional)"
        />
        <div>
          <label className="block font-semibold mb-1">Date & Time</label>
          <DatePicker
            selected={blog.date}
            onChange={handleDateChange}
            showTimeSelect
            dateFormat="Pp"
            className="w-full border px-4 py-2 rounded"
          />
        </div>
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
        <div>
          <label className="block font-semibold mb-1">Main Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full border px-4 py-2 rounded"
          />
          {blog.image && (
            <img src={blog.image} alt="Preview" className="mt-2 rounded max-h-48" />
          )}
        </div>
        <label className="block font-semibold">Article Content</label>
        <ReactQuill
          theme="snow"
          value={blog.content}
          onChange={handleContentChange}
          modules={quillModules}
          formats={quillFormats}
          className="bg-white"
          style={{ minHeight: 300 }}
        />
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