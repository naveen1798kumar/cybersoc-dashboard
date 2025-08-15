import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

const API_BASE = "/api";

export default function AdminServiceForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [categories, setCategories] = useState([]);
  const [uploading, setUploading] = useState(false);

  // Fetch categories
  useEffect(() => {
    fetch(`${API_BASE}/categories`)
      .then((res) => res.json())
      .then((data) =>
        setCategories(Array.isArray(data) ? data : data.categories || [])
      )
      .catch(() => toast.error("Failed to load categories"));
  }, []);

  // Fetch service data if editing
  useEffect(() => {
    if (id) {
      fetch(`${API_BASE}/services/${id}`)
        .then((res) => res.json())
        .then((data) =>
          setForm({
            category: data.category || "",
            title: data.title || "",
            summary: data.summary || "",
            description: data.description || "",
            image: data.image || "",
            bannerImage: data.bannerImage || "",
            benefitsImage: data.benefitsImage || "",
            faqImage: data.faqImage || "",
            sections: Array.isArray(data.sections) ? data.sections : [],
            benefits: Array.isArray(data.benefits) ? data.benefits : [],
            features: Array.isArray(data.features) ? data.features : [],
            faqs: Array.isArray(data.faqs) ? data.faqs : [],
            faqSectionImage: data.faqSectionImage || "",
            galleryEnabled: Boolean(data.galleryEnabled),
            gallery: Array.isArray(data.gallery) ? data.gallery : [],
            metaTitle: data.metaTitle || "",
            metaDescription: data.metaDescription || "",
            keywords: data.keywords || "",
          })
        )
        .catch(() => toast.error("Failed to load service"));
    } else {
      setForm({
        category: "",
        title: "",
        summary: "",
        description: "",
        image: "",
        bannerImage: "",
        benefitsImage: "",
        faqImage: "",
        sections: [],
        benefits: [],
        features: [],
        faqs: [],
        faqSectionImage: "",
        galleryEnabled: false,
        gallery: [],
        metaTitle: "",
        metaDescription: "",
        keywords: "",
      });
    }
  }, [id]);

  const handleChange = (e) => {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm({ ...form, [e.target.name]: value });
  };

  const handleArrayChange = (field, idx, key, value) => {
    const arr = [...form[field]];
    if (typeof idx === "number") {
      if (key) arr[idx][key] = value;
      else arr[idx] = value;
    }
    setForm({ ...form, [field]: arr });
  };

  const handleArrayAdd = (field, empty) => {
    setForm({ ...form, [field]: [...form[field], empty] });
  };

  const handleArrayRemove = (field, idx) => {
    const arr = [...form[field]];
    arr.splice(idx, 1);
    setForm({ ...form, [field]: arr });
  };

  const handleUpload = async (cb) => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.onchange = async () => {
      const file = fileInput.files[0];
      if (!file) return;
      setUploading(true);
      const formData = new FormData();
      formData.append("image", file);
      formData.append("fileName", file.name);
      try {
        const res = await fetch(`${API_BASE}/upload/image/service`, {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        if (data.url) cb(data.url);
        else toast.error("Upload failed");
      } catch {
        toast.error("Upload error");
      }
      setUploading(false);
    };
    fileInput.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = id ? "PUT" : "POST";
    const url = id ? `${API_BASE}/services/${id}` : `${API_BASE}/services`;
    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        toast.success(`Service ${id ? "updated" : "created"} successfully`);
        navigate("/dashboard/services");
      } else {
        toast.error("Failed to save service");
      }
    } catch {
      toast.error("Error saving service");
    }
  };

  if (!form) return null;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">
        {id ? "Edit" : "Add"} Service
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Category */}
        <div>
          <label className="font-semibold">Category</label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.title}
              </option>
            ))}
          </select>
        </div>

        {/* Title / Summary / Description */}
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Title"
          required
          className="w-full border px-3 py-2 rounded"
        />
        <input
          name="summary"
          value={form.summary}
          onChange={handleChange}
          placeholder="Short Summary"
          className="w-full border px-3 py-2 rounded"
        />
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Full Description"
          className="w-full border px-3 py-2 rounded"
        />

        {/* Images */}
        {["image", "bannerImage", "benefitsImage", "faqImage"].map((field) => (
          <div key={field}>
            <label className="font-semibold capitalize">{field}</label>
            <button
              type="button"
              onClick={() =>
                handleUpload((url) =>
                  setForm((f) => ({ ...f, [field]: url }))
                )
              }
              className="text-blue-600 ml-2"
            >
              Upload
            </button>
            {uploading && (
              <span className="ml-2 text-sm text-blue-500">Uploading...</span>
            )}
            {form[field] && (
              <img
                src={form[field]}
                alt=""
                className="h-24 mt-2 rounded shadow"
              />
            )}
          </div>
        ))}

        {/* Sections */}
        <div>
          <label className="font-semibold">Sections</label>
          {form.sections.map((sec, idx) => (
            <div
              key={idx}
              className="border p-3 rounded mb-2 space-y-2"
            >
              <input
                value={sec.title}
                onChange={(e) =>
                  handleArrayChange("sections", idx, "title", e.target.value)
                }
                placeholder="Title"
                className="w-full border px-2 py-1 rounded"
              />
              <textarea
                value={sec.content}
                onChange={(e) =>
                  handleArrayChange("sections", idx, "content", e.target.value)
                }
                placeholder="Content"
                className="w-full border px-2 py-1 rounded"
              />
              <button
                type="button"
                onClick={() =>
                  handleUpload((url) =>
                    handleArrayChange("sections", idx, "image", url)
                  )
                }
                className="text-blue-600"
              >
                Upload Image
              </button>
              {sec.image && (
                <img
                  src={sec.image}
                  alt=""
                  className="h-16 rounded shadow"
                />
              )}
              <button
                type="button"
                onClick={() => handleArrayRemove("sections", idx)}
                className="text-red-600"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              handleArrayAdd("sections", { title: "", content: "", image: "" })
            }
            className="text-blue-600"
          >
            + Add Section
          </button>
        </div>

        {/* Benefits */}
        <div>
          <label className="font-semibold">Key Benefits</label>
          {form.benefits.map((b, idx) => (
            <div key={idx} className="flex gap-2 mb-2">
              <input
                value={b}
                onChange={(e) =>
                  handleArrayChange("benefits", idx, null, e.target.value)
                }
                placeholder="Benefit"
                className="border px-2 py-1 rounded w-full"
              />
              <button
                type="button"
                onClick={() => handleArrayRemove("benefits", idx)}
                className="text-red-600"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => handleArrayAdd("benefits", "")}
            className="text-blue-600"
          >
            + Add Benefit
          </button>
        </div>

        {/* Features */}
        <div>
          <label className="font-semibold">Features</label>
          {form.features.map((f, idx) => (
            <div key={idx} className="flex gap-2 mb-2">
              <input
                value={f.title}
                onChange={(e) =>
                  handleArrayChange("features", idx, "title", e.target.value)
                }
                placeholder="Title"
                className="w-1/3 border px-2 py-1 rounded"
              />
              <input
                value={f.description}
                onChange={(e) =>
                  handleArrayChange(
                    "features",
                    idx,
                    "description",
                    e.target.value
                  )
                }
                placeholder="Description"
                className="w-2/3 border px-2 py-1 rounded"
              />
              <button
                type="button"
                onClick={() => handleArrayRemove("features", idx)}
                className="text-red-600"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              handleArrayAdd("features", { title: "", description: "" })
            }
            className="text-blue-600"
          >
            + Add Feature
          </button>
        </div>

        {/* FAQs */}
        <div>
          <label className="font-semibold">FAQs</label>
          {form.faqs.map((faq, idx) => (
            <div key={idx} className="border p-3 rounded mb-2 space-y-2">
              <input
                value={faq.question}
                onChange={(e) =>
                  handleArrayChange("faqs", idx, "question", e.target.value)
                }
                placeholder="Question"
                className="w-full border px-2 py-1 rounded"
              />
              <textarea
                value={faq.answer}
                onChange={(e) =>
                  handleArrayChange("faqs", idx, "answer", e.target.value)
                }
                placeholder="Answer"
                className="w-full border px-2 py-1 rounded"
              />
              <button
                type="button"
                onClick={() => handleArrayRemove("faqs", idx)}
                className="text-red-600"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              handleArrayAdd("faqs", { question: "", answer: "" })
            }
            className="text-blue-600"
          >
            + Add FAQ
          </button>
        </div>

        {/* Gallery */}
        <div>
          <label className="font-semibold flex items-center gap-2">
            <input
              type="checkbox"
              name="galleryEnabled"
              checked={form.galleryEnabled}
              onChange={handleChange}
            />
            Enable Gallery
          </label>

          {form.galleryEnabled && (
            <div className="mt-2">
              {form.gallery.map((img, idx) => (
                <div key={idx} className="flex items-center gap-2 mb-2">
                  <img
                    src={img}
                    alt=""
                    className="h-16 rounded shadow"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const updated = [...form.gallery];
                      updated.splice(idx, 1);
                      setForm({ ...form, gallery: updated });
                    }}
                    className="text-red-600"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() =>
                  handleUpload((url) =>
                    setForm({ ...form, gallery: [...form.gallery, url] })
                  )
                }
                className="text-blue-600"
              >
                + Add Image
              </button>
            </div>
          )}
        </div>

        {/* SEO */}
        <div>
          <label className="font-semibold">Meta Title</label>
          <input
            name="metaTitle"
            value={form.metaTitle}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div>
          <label className="font-semibold">Meta Description</label>
          <textarea
            name="metaDescription"
            value={form.metaDescription}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div>
          <label className="font-semibold">Keywords</label>
          <input
            name="keywords"
            value={form.keywords}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate("/dashboard/services")}
            className="px-4 py-2 border rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-green-600 text-white rounded"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}


// const method = id ? "PUT" : "POST";
// const url = id ? `${API_BASE}/services/${id}` : `${API_BASE}/services`;
