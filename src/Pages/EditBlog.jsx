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
  const [title, setTitle] = useState('')
  const [subTitle, setSubTitle] = useState('')
  const [category, setCategory] = useState('')
  const [isPublished, setIsPublished] = useState(false)
  const [image, setImage] = useState(null)
  const [existingImageURL, setExistingImageURL] = useState('')

  // Initialize Quill
  useEffect(() => {
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, { theme: 'snow' })
    }
  }, [])

  // Fetch blog if editing
  useEffect(() => {
    if (id && quillRef.current) fetchBlogDetails()
  }, [id, quillRef.current])

  const fetchBlogDetails = async () => {
    setIsLoading(true)
    try {
      const { data } = await axios.get(`/api/blog/${id}`)
      if (data.success) {
        const blog = data.blog
        setTitle(blog.title)
        setSubTitle(blog.subTitle)
        setCategory(blog.category)
        setIsPublished(blog.isPublished)
        setExistingImageURL(blog.image)
        quillRef.current.root.innerHTML = blog.description || ''
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error('Error fetching blog.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSaving(true)

    try {

      const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

      const blog = {
        title,
        subTitle,
        description: quillRef.current.root.innerHTML,
        category,
        isPublished,
        author: "Admin",
        slug
      }

      const formData = new FormData()
      formData.append('blog', JSON.stringify(blog))
      if (image) formData.append('image', image)

      const url = id ? `/blogs/update/${id}` : '/blogs/add'
      const method = id ? 'put' : 'post'
      const { data } = await axios[method](url, formData)

      if (data.success) {
        toast.success(data.message)
        navigate('/dashboard/blogs')
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error('Failed to save blog.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex-1 bg-blue-50/50 text-gray-600 h-full">
      <div className="bg-white w-full max-w-3xl p-4 md:p-10 sm:m-10 shadow rounded">
        <h2 className="text-lg font-semibold mb-4">{id ? 'Edit Blog' : 'Add New Blog'}</h2>

        <p>Upload Thumbnail</p>
        <label htmlFor="image">
          <img
            src={
              image
                ? URL.createObjectURL(image)
                : existingImageURL || '/placeholder.png'
            }
            alt="Thumbnail"
            className="mt-2 h-16 rounded cursor-pointer"
          />
          <input
            type="file"
            onChange={(e) => setImage(e.target.files[0])}
            id="image"
            hidden
            required={!id}
          />
        </label>

        <p className="mt-4">Blog Title</p>
        <input
          type="text"
          required
          placeholder="Type here"
          className="w-full max-w-lg mt-2 p-2 border border-gray-300 outline-none rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <p className="mt-4">Sub Title</p>
        <input
          type="text"
          required
          placeholder="Type here"
          className="w-full max-w-lg mt-2 p-2 border border-gray-300 outline-none rounded"
          value={subTitle}
          onChange={(e) => setSubTitle(e.target.value)}
        />

        <p className="mt-4">Description</p>
        <div className="max-w-lg h-72 pb-16 pt-2 relative">
          <div ref={editorRef}></div>
        </div>

        <p className="mt-4">Category</p>
        <select
          required
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="mt-2 px-3 py-2 border text-gray-500 border-gray-300 outline-none rounded"
        >
          <option value="">Select Category</option>
          {blogCategories.map((item, i) => (
            <option key={i} value={item}>
              {item}
            </option>
          ))}
        </select>

        <div className="flex gap-2 mt-4 items-center">
          <p>Publish Now</p>
          <input
            type="checkbox"
            checked={isPublished}
            onChange={(e) => setIsPublished(e.target.checked)}
            className="scale-125 cursor-pointer"
          />
        </div>

        <button
          type="submit"
          disabled={isSaving || isLoading}
          className="mt-8 w-40 h-10 bg-primary text-black rounded cursor-pointer text-sm"
        >
          {isSaving ? (id ? 'Updating...' : 'Adding...') : id ? 'Update Blog' : 'Add Blog'}
        </button>
      </div>
    </form>
  )
}

export default EditBlog
