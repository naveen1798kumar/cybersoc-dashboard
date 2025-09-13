// AdminAddJob.jsx
import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const AdminAddJob = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    minQualification: "",
    openings: "1",
    experience: "",
    location: "",
    timing: "",
    shift: "",
    salary: "",
    type: "",
    skills: "",
    description: "",
  });

  const skillsArray = useMemo(
    () =>
      formData.skills
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0),
    [formData.skills]
  );

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    // simple client-side checks
    if (!skillsArray.length) {
      toast.error("Please add at least one skill.");
      return;
    }
    if (!formData.description || formData.description.length < 30) {
      toast.error("Description should be at least 30 characters.");
      return;
    }

    try {
      setSubmitting(true);
      await axios.post("/api/jobs", {
        ...formData,
        openings: Number(formData.openings) || 1,
        skills: skillsArray,
      });
      toast.success("✅ Job posted successfully!");
      navigate("/dashboard/careers");
    } catch (err) {
      toast.error("❌ Error posting job");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="py-8 px-4 md:px-8 max-w-5xl mx-auto">
      {/* Header / Breadcrumb */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">Dashboard / Careers</p>
          <h1 className="text-3xl font-extrabold tracking-tight text-[#027070]">
            Add New Job
          </h1>
        </div>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section 1: Job Basics */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="px-6 py-4 border-b">
            <h2 className="text-xl font-semibold text-gray-900">
              1) Job Basics
            </h2>
            <p className="text-sm text-gray-500">
              Provide the essential details of the role.
            </p>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Job Title <span className="text-red-500">*</span>
              </label>
              <input
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Senior Frontend Engineer"
                className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-[#027070] focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Job Type <span className="text-red-500">*</span>
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-[#027070] focus:outline-none"
                required
              >
                <option value="">Select Job Type</option>
                <option value="Full-Time">Full-Time</option>
                <option value="Part-Time">Part-Time</option>
                <option value="Internship">Internship</option>
                <option value="Contract">Contract</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location <span className="text-red-500">*</span>
              </label>
              <input
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g., Bengaluru, IN (Hybrid)"
                className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-[#027070] focus:outline-none"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                You can include hybrid/remote info here.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Minimum Qualification
              </label>
              <input
                name="minQualification"
                value={formData.minQualification}
                onChange={handleChange}
                placeholder="e.g., B.Tech / BSc Computer Science"
                className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-[#027070] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Work Timing
              </label>
              <input
                name="timing"
                value={formData.timing}
                onChange={handleChange}
                placeholder="e.g., 9:00 AM – 6:00 PM"
                className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-[#027070] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Shift
              </label>
              <select
                name="shift"
                value={formData.shift}
                onChange={handleChange}
                className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-[#027070] focus:outline-none"
              >
                <option value="">Select Shift</option>
                <option value="Day">Day</option>
                <option value="Night">Night</option>
                <option value="Rotational">Rotational</option>
                <option value="Flexible">Flexible</option>
              </select>
            </div>
          </div>
        </section>

        {/* Section 2: Compensation & Openings */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="px-6 py-4 border-b">
            <h2 className="text-xl font-semibold text-gray-900">
              2) Compensation & Openings
            </h2>
            <p className="text-sm text-gray-500">
              Share the package, total positions, and experience required.
            </p>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Experience <span className="text-red-500">*</span>
              </label>
              <input
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                placeholder="e.g., 3–5 years"
                className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-[#027070] focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Openings <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="1"
                name="openings"
                value={formData.openings}
                onChange={handleChange}
                placeholder="e.g., 3"
                className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-[#027070] focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Salary (CTC / Range) <span className="text-red-500">*</span>
              </label>
              <input
                name="salary"
                value={formData.salary}
                onChange={handleChange}
                placeholder="e.g., ₹12–18 LPA / $90–120k"
                className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-[#027070] focus:outline-none"
                required
              />
            </div>
          </div>
        </section>

        {/* Section 3: Description & Skills */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="px-6 py-4 border-b">
            <h2 className="text-xl font-semibold text-gray-900">
              3) Description & Skills
            </h2>
            <p className="text-sm text-gray-500">
              Write a concise, compelling description and list the required
              skills.
            </p>
          </div>
          <div className="p-6 grid grid-cols-1 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Job Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={6}
                placeholder="Role overview, responsibilities, what success looks like, team, tools/stack, perks, etc."
                className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-[#027070] focus:outline-none"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Tip: Use short paragraphs and bullet points for readability.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Required Skills (comma-separated){" "}
                <span className="text-red-500">*</span>
              </label>
              <input
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                placeholder="e.g., React, TypeScript, Tailwind, REST API"
                className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-[#027070] focus:outline-none"
                required
              />
              {!!skillsArray.length && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {skillsArray.map((tag, i) => (
                    <span
                      key={`${tag}-${i}`}
                      className="inline-flex items-center rounded-full bg-teal-50 text-teal-700 border border-teal-200 px-3 py-1 text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              <p className="text-xs text-gray-500 mt-2">
                Separate skills with commas. Example: <i>Node.js, GraphQL, AWS</i>
              </p>
            </div>
          </div>
        </section>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate("/dashboard/careers")}
            className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
          >
            Back to Careers
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-2 rounded-lg bg-[#027070] px-6 py-3 font-semibold text-white hover:bg-[#025a5a] disabled:opacity-70"
          >
            {submitting ? "Posting…" : "Post Job"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminAddJob;
