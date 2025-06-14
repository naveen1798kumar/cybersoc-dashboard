import React, { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Quill from 'quill'
import toast from 'react-hot-toast'
import { useAppContext } from '../context/AppContext'
import 'quill/dist/quill.snow.css'

// Replace with your actual categories
const blogCategories = ['Automation', 'Networking', 'Business', 'Information', 'Education']

const EditBlog = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { axios } = useAppContext()

  const editorRef = useRef(null)
  const quillRef = useRef(null)

  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [quillReady, setQuillReady] = useState(false)

  const [title, setTitle] = useState('')
  const [subTitle, setSubTitle] = useState('')
  const [category, setCategory] = useState('')
  const [isPublished, setIsPublished] = useState(false)
  const [image, setImage] = useState(null)
  const [existingImageURL, setExistingImageURL] = useState('')

  // Initialize Quill
  useEffect(() => {
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, { theme: 'snow', modules: {
          toolbar: [
            [{ header: [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            ['blockquote', 'code-block'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['link', 'image'],
            ['clean'],
          ],
        } })
      setQuillReady(true)
    }
  }, [])

  // Fetch blog if editing
  useEffect(() => {
    if (id && quillReady) fetchBlogDetails()
  }, [id, quillReady])

  const fetchBlogDetails = async () => {
    setIsLoading(true)
    try {
      const { data } = await axios.get(`/blogs/${id}`)
      if (data.success) {
        const blog = data.blog
        setTitle(blog.title || '')
        setSubTitle(blog.subTitle || '')
        setCategory(blog.category || '')
        setIsPublished(blog.isPublished || false)

        setExistingImageURL(blog.image || '')
        if (quillRef.current && quillRef.current.root) {
          quillRef.current.root.innerHTML = blog.description || ''
        }

      } else {
        toast.error(data.message || 'Failed to load blog details.')
      }
    } catch (error) {
      console.log('Fetch Error', error);      
      toast.error('Error fetching blog.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      if (!title.trim()) {
        toast.error('Title cannot be empty.')
        setIsSaving(false)
        return
      }

    if (!category) {
      toast.error('Please select a category.');
      setIsSaving(false);
      return;
    }

      const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const formData = new FormData()
  formData.append('title', title);
  formData.append('subTitle', subTitle);
  formData.append('description', quillRef.current.root.innerHTML);
  formData.append('category', category);
  formData.append('slug', slug);
  formData.append('isPublished', isPublished);
  formData.append('author', 'Admin');

    if (image) formData.append('image', image); 
    // if (image) {
    //   formData.append('image', image)
    // }

    const url = id ? `/blogs/update/${id}` : '/blogs/add'
    const method = id ? 'put' : 'post'

    const { data } = await axios[method](url, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })

    if (data?.success) {
      toast.success(data.message || 'Blog saved successfully.')
      navigate('/dashboard/blogs')
    } else {
      toast.error(data.message || 'Failed to save blog.')
    }
  } catch (error) {
    console.error('Save blog error:', error)
    toast.error(error.response?.data?.message || 'Failed to save blog.')
  } finally {
    setIsSaving(false)
  }
}

  // Clean up object URLs created for preview
  useEffect(() => {
    let url
    if (image) {
      url = URL.createObjectURL(image)
    }
    return () => {
      if (url) URL.revokeObjectURL(url)
    }
  }, [image])

  return (
<form onSubmit={handleSubmit} className="flex-1 bg-blue-50/50 text-gray-700 min-h-screen py-10 px-4">
  <div className="bg-white w-full max-w-3xl mx-auto p-6 md:p-10 rounded-xl shadow-lg space-y-6">
    <h2 className="text-2xl font-semibold text-gray-800">{id ? 'Edit Blog' : 'Add New Blog'}</h2>

    {/* Thumbnail Upload */}
    <div>
      <label className="block text-sm font-medium mb-1">Upload Thumbnail</label>
      <div className="w-32 h-32 rounded-2xl border border-dashed border-gray-300 flex items-center justify-center overflow-hidden cursor-pointer bg-gray-50 hover:border-blue-400 transition">
        <label htmlFor="image" className="cursor-pointer w-full h-full flex items-center justify-center">
          <img
            src={image ? URL.createObjectURL(image) : existingImageURL || '/upload_area.svg'}
            alt="Thumbnail"
            className="object-cover w-full h-full"
          />
        </label>
        <input
          type="file"
          id="image"
          hidden
          onChange={(e) => setImage(e.target.files[0])}
          required={!id}
        />
      </div>
    </div>

    {/* Title */}
    <div>
      <label className="block text-sm font-medium mb-1">Blog Title</label>
      <input
        type="text"
        required
        placeholder="Enter blog title"
        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
    </div>

    {/* Subtitle */}
    <div>
      <label className="block text-sm font-medium mb-1">Sub Title</label>
      <input
        type="text"
        required
        placeholder="Enter subtitle"
        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        value={subTitle}
        onChange={(e) => setSubTitle(e.target.value)}
      />
    </div>

    {/* Description */}
    <div>
      <label className="block text-sm font-medium mb-1">Description</label>
      <div className="h-72 border border-gray-300 rounded-lg overflow-hidden">
        <div ref={editorRef} className="h-full px-2 pt-2 bg-white" />
      </div>
    </div>

    {/* Category */}
    <div>
      <label className="block text-sm font-medium mb-1">Category</label>
      <select
        required
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 "
      >
        <option value="">Select a category</option>
        {blogCategories.map((cat, idx) => (
          <option key={idx} value={cat}>{cat}</option>
        ))}
      </select>
    </div>

    {/* Publish Checkbox */}
    <div className="flex items-center gap-3">
      <input
        type="checkbox"
        checked={isPublished}
        onChange={(e) => setIsPublished(e.target.checked)}
        className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
      />
      <label className="text-sm font-medium">Publish Now</label>
    </div>

    {/* Submit Button */}
    <div>
      <button
        type="submit"
        disabled={isSaving || isLoading}
        className={`w-full py-3 rounded-lg text-white text-sm font-medium transition ${
          isSaving || isLoading
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
        }`}
      >
        {isSaving ? (id ? 'Updating...' : 'Adding...') : id ? 'Update Blog' : 'Add Blog'}
      </button>
    </div>
  </div>
</form>

  )
}

export default EditBlog
