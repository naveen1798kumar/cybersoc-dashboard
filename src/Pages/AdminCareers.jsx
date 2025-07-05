import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaTrash, FaEye, FaInfoCircle } from 'react-icons/fa';
import toast from 'react-hot-toast';

const AdminCareers = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    minQualification: '',
    openings: '',
    experience: '',
    location: '',
    timing: '',
    shift: '',
    salary: '',
    type: '', // ✅ added
    skills: '',
    description: '',
  });

  const fetchJobs = async () => {
    try {
      const res = await axios.get('/api/jobs');
      setJobs(res.data);
    } catch (err) {
      toast.error('Failed to fetch jobs');
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/jobs', {
  ...formData,
  skills: formData.skills.split(',').map((s) => s.trim()), // ✅ convert to array
});
      toast.success('Job posted successfully!');
      setFormData({
        title: '',
        minQualification: '',
        openings: '',
        experience: '',
        location: '',
        timing: '',
        shift: '',
        salary: '',
        type: '', // ✅ reset
        skills: '',
        description: '',
      });
      fetchJobs();
    } catch (err) {
      toast.error('Error posting job');
    }
  };

  const deleteJob = async (id) => {
    if (!window.confirm('Are you sure you want to delete this job?')) return;
    try {
      await axios.delete(`/api/jobs/${id}`);
      toast.success('Job deleted successfully');
      fetchJobs();
    } catch (err) {
      toast.error('Failed to delete job');
    }
  };

  return (
    <div className="p-6 space-y-10">
      <h2 className="text-3xl font-bold text-[#027070] mb-6">Manage Career Listings</h2>

      {/* Job Form */}
      <div className="bg-white rounded-xl shadow-lg p-6 space-y-4 border border-gray-100">
        <h3 className="text-xl font-semibold text-gray-700">Post a New Job</h3>
        <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
          {[{ name: 'title', placeholder: 'Job Title' },
            { name: 'minQualification', placeholder: 'Minimum Qualification' },
            { name: 'openings', placeholder: 'Number of Openings' },
            { name: 'experience', placeholder: 'Required Experience' },
            { name: 'location', placeholder: 'Location' },
            { name: 'timing', placeholder: 'Work Timing (e.g. 9AM - 6PM)' },
            { name: 'shift', placeholder: 'Shift (e.g. Day/Night)' },
            { name: 'salary', placeholder: 'Salary Details' }]
            .map((input) => (
              <input
                key={input.name}
                name={input.name}
                value={formData[input.name]}
                onChange={handleChange}
                placeholder={input.placeholder}
                className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-[#027070]"
                required
              />
            ))}

          {/* Type Dropdown */}
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-[#027070]"
            required
          >
            <option value="">Select Job Type</option>
            <option value="Full-Time">Full-Time</option>
            <option value="Part-Time">Part-Time</option>
            <option value="Internship">Internship</option>
            <option value="Contract">Contract</option>
          </select>

          {/* Skills */}
          <input
            name="skills"
            value={formData.skills}
            onChange={handleChange}
            placeholder="Required Skills (comma-separated)"
            className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-[#027070] md:col-span-2"
            required
          />

          {/* Description */}
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Job Description"
            rows="5"
            className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-[#027070] md:col-span-2"
            required
          />

          <button
            type="submit"
            className="md:col-span-2 bg-[#027070] hover:bg-[#026060] text-white font-semibold py-2 px-6 rounded-lg transition"
          >
            Post Job
          </button>
        </form>
      </div>

      {/* Job Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.map((job) => (
          <div
            key={job._id}
            className="bg-white border border-gray-200 rounded-xl p-5 shadow-md hover:shadow-xl transition-all space-y-3"
          >
            <div>
              <h3 className="text-xl font-bold text-gray-800">{job.title}</h3>
              <p className="text-sm text-gray-500">
                {job.location} • {job.shift} • {job.timing}
              </p>
              <p className="text-sm text-gray-600">{job.type}</p>
              <p className="text-sm text-gray-600 line-clamp-3">{job.description}</p>
            </div>

            <div className="flex justify-between gap-2 flex-wrap pt-2 text-sm">
              <button
                onClick={() => setSelectedJob(job)}
                className="text-blue-600 hover:underline flex items-center gap-1"
              >
                <FaInfoCircle /> View
              </button>

              <Link
                to={`/dashboard/careers/${job._id}/applications`}
                className="text-[#027070] hover:underline flex items-center gap-1"
              >
                <FaEye /> Applications
              </Link>

              <button
                onClick={() => deleteJob(job._id)}
                className="text-red-600 hover:text-red-700 flex items-center gap-1"
              >
                <FaTrash /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* View Job Modal */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 bg-black/50 flex justify-center items-center px-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-xl relative">
            <button
              onClick={() => setSelectedJob(null)}
              className="absolute top-4 right-4 text-gray-500 hover:text-red-500 text-xl font-bold"
            >
              ×
            </button>

            <h3 className="text-2xl font-bold text-[#027070] mb-3">{selectedJob.title}</h3>
            <p className="text-sm text-gray-600 mb-2">
              {selectedJob.location} • {selectedJob.shift} • {selectedJob.timing}
            </p>

            <div className="text-sm text-gray-700 space-y-2">
              <p><strong>Minimum Qualification:</strong> {selectedJob.minQualification}</p>
              <p><strong>Experience:</strong> {selectedJob.experience}</p>
              <p><strong>Openings:</strong> {selectedJob.openings}</p>
              <p><strong>Type:</strong> {selectedJob.type}</p>
              <p><strong>Salary:</strong> {selectedJob.salary}</p>
              <p><strong>Description:</strong><br />{selectedJob.description}</p>
              <div>
                <p><strong>Required Skills:</strong></p>
              <ul className="list-disc ml-5">
                {Array.isArray(selectedJob.skills)
                  ? selectedJob.skills.map((skill, i) => (
                      <li key={i}>{skill}</li>
                    ))
                  : null}
              </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCareers;
