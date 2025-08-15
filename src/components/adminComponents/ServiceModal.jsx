import React, { useState } from "react";
import toast from "react-hot-toast";

export default function ServiceModal({ initialData, onSubmit, onClose }) {
  const data = initialData || {};
  const [form, setForm] = useState({
    title: data.title || "",
    description: data.description || "",
    bannerImage: data.bannerImage || "",
    sections: data.sections || [],
    benefits: data.benefits || [],
    benefitsImage: data.benefitsImage || "",
    features: data.features || [],
    faqs: data.faqs || [],
    faqImage: data.faqImage || "",
  });
  const [uploading, setUploading] = useState(false);

  const handleArrayChange = (field, idx, key, value) => {
    setForm((prev) => {
      const arr = [...prev[field]];
      arr[idx][key] = value;
      return { ...prev, [field]: arr };
    });
  };

  const handleArrayAdd = (field, emptyObj) => {
    setForm((prev) => ({ ...prev, [field]: [...prev[field], emptyObj] }));
  };

  const handleArrayRemove = (field, idx) => {
    setForm((prev) => {
      const arr = [...prev[field]];
      arr.splice(idx, 1);
      return { ...prev, [field]: arr };
    });
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

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
        const res = await fetch("/api/upload/image/service", {
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <form
        className="bg-white p-6 rounded-lg shadow-xl w-full max-w-4xl space-y-4 relative overflow-y-auto max-h-[90vh]"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit(form);
        }}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-red-500 text-2xl"
        >
          ×
        </button>
        <h2 className="text-xl font-bold mb-2">
          {data._id ? "Edit" : "Add"} Service
        </h2>

        {/* Banner Image */}
        <div>
          <label className="font-semibold">Banner Image</label>
          <button
            type="button"
            onClick={() => handleUpload((url) => setForm((f) => ({ ...f, bannerImage: url })))}
            className="text-blue-600 ml-2"
          >
            Upload
          </button>
          {uploading && <span className="ml-2 text-sm text-blue-500">Uploading...</span>}
          {form.bannerImage && <img src={form.bannerImage} alt="" className="h-24 mt-2 rounded shadow" />}
        </div>

        {/* Title & Description */}
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Service Title"
          className="w-full border px-3 py-2 rounded"
          required
        />
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          className="w-full border px-3 py-2 rounded"
        />

        {/* Sections */}
        <div>
          <label className="font-semibold">Details (Sections)</label>
          {form.sections.map((section, idx) => (
            <div key={idx} className="border-b pb-2 mb-2">
              <div className="flex gap-2">
                <input
                  value={section.title}
                  onChange={(e) => handleArrayChange("sections", idx, "title", e.target.value)}
                  placeholder="Title"
                  className="w-1/3 border px-2 py-1 rounded"
                />
                <input
                  value={section.content}
                  onChange={(e) => handleArrayChange("sections", idx, "content", e.target.value)}
                  placeholder="Content"
                  className="w-2/3 border px-2 py-1 rounded"
                />
              </div>
              <div className="flex items-center gap-2 mt-1">
                <button
                  type="button"
                  onClick={() => handleUpload((url) => handleArrayChange("sections", idx, "image", url))}
                  className="text-blue-600"
                >
                  Upload Image
                </button>
                {section.image && <img src={section.image} alt="" className="h-16 rounded shadow" />}
                <button
                  type="button"
                  onClick={() => handleArrayRemove("sections", idx)}
                  className="text-red-600 ml-auto"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={() => handleArrayAdd("sections", { title: "", content: "", image: "" })}
            className="text-blue-600"
          >
            + Add Section
          </button>
        </div>

        {/* Benefits */}
        <div>
          <label className="font-semibold">Key Benefits</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              {form.benefits.map((benefit, idx) => (
                <div key={idx} className="flex gap-2 mb-2">
                  <input
                    value={benefit}
                    onChange={(e) => {
                      const arr = [...form.benefits];
                      arr[idx] = e.target.value;
                      setForm((prev) => ({ ...prev, benefits: arr }));
                    }}
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
            <div>
              <label className="font-semibold">Benefits Image</label>
              <br />
              <button
                type="button"
                onClick={() => handleUpload((url) => setForm((f) => ({ ...f, benefitsImage: url })))}
                className="text-blue-600"
              >
                Upload
              </button>
              {form.benefitsImage && <img src={form.benefitsImage} alt="" className="h-24 mt-2 rounded shadow" />}
            </div>
          </div>
        </div>

        {/* Features */}
        <div>
          <label className="font-semibold">Features</label>
          {form.features.map((feature, idx) => (
            <div key={idx} className="flex gap-2 mb-2">
              <input
                value={feature.title}
                onChange={(e) => handleArrayChange("features", idx, "title", e.target.value)}
                placeholder="Title"
                className="w-1/3 border px-2 py-1 rounded"
              />
              <input
                value={feature.description}
                onChange={(e) => handleArrayChange("features", idx, "description", e.target.value)}
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
            onClick={() => handleArrayAdd("features", { title: "", description: "" })}
            className="text-blue-600"
          >
            + Add Feature
          </button>
        </div>

        {/* FAQs */}
        <div>
          <label className="font-semibold">FAQs</label>
          {form.faqs.map((faq, idx) => (
            <div key={idx} className="flex gap-2 mb-2">
              <input
                value={faq.question}
                onChange={(e) => handleArrayChange("faqs", idx, "question", e.target.value)}
                placeholder="Question"
                className="w-1/2 border px-2 py-1 rounded"
              />
              <input
                value={faq.answer}
                onChange={(e) => handleArrayChange("faqs", idx, "answer", e.target.value)}
                placeholder="Answer"
                className="w-1/2 border px-2 py-1 rounded"
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
            onClick={() => handleArrayAdd("faqs", { question: "", answer: "" })}
            className="text-blue-600"
          >
            + Add FAQ
          </button>
        </div>
        <div className="mt-2">
          <label className="font-semibold">FAQ Section Image</label>
          <br />
          <button
            type="button"
            onClick={() => handleUpload((url) => setForm((f) => ({ ...f, faqImage: url })))}
            className="text-blue-600"
          >
            Upload
          </button>
          {form.faqImage && <img src={form.faqImage} alt="" className="h-24 mt-2 rounded shadow" />}
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
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
