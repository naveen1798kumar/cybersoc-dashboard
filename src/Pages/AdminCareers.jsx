// Pages/AdminCareers.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaTrash, FaEye } from 'react-icons/fa';
import toast from 'react-hot-toast';

const AdminCareers = () => {
  const [jobs, setJobs] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    type: '',
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/jobs', formData);
      toast.success('Job posted successfully!');
      setFormData({ title: '', location: '', type: '', description: '' });
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
          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Job Title"
            className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-[#027070]"
            required
          />
          <input
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Location"
            className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-[#027070]"
            required
          />
          <input
            name="type"
            value={formData.type}
            onChange={handleChange}
            placeholder="Job Type (e.g. Full-Time)"
            className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-[#027070]"
            required
          />
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Job Description"
            className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-[#027070] md:col-span-2"
            rows="5"
            required
          ></textarea>
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
            className="bg-white border border-gray-200 rounded-xl p-5 shadow-md hover:shadow-xl transition-all"
          >
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-gray-800">{job.title}</h3>
              <p className="text-sm text-gray-500">{job.location} • {job.type}</p>
              <p className="text-sm text-gray-600 mt-2 line-clamp-3">{job.description}</p>
            </div>
            <div className="flex justify-between items-center mt-4 text-sm">
              <Link
                to={`/dashboard/careers/${job._id}/applications`}
                className="text-[#027070] font-medium hover:underline flex items-center gap-1"
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
    </div>
  );
};

export default AdminCareers;
