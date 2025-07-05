// Pages/JobApplications.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { FaDownload, FaEnvelope, FaUser } from 'react-icons/fa';

const JobApplications = () => {
  const { jobId } = useParams();
  const [applications, setApplications] = useState([]);
  const [jobTitle, setJobTitle] = useState('');

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await axios.get(`/api/career/${jobId}/applications`);
        setApplications(res.data.applications);
        setJobTitle(res.data.jobTitle);
      } catch (err) {
        console.error('Error fetching applications');
      }
    };
    fetchApplications();
  }, [jobId]);

  const handleDelete = async (id) => {
  if (!window.confirm("Are you sure you want to delete this application?")) return;

  try {
    await axios.delete(`/api/career/application/${id}`);
    setApplications((prev) => prev.filter((app) => app._id !== id));
  } catch (err) {
    console.error("Failed to delete application:", err);
    alert("Failed to delete. Please try again.");
  }
};

  return (
<div className="p-6 md:p-10 bg-gray-50 min-h-screen">
  <h2 className="text-3xl font-bold text-[#027070] mb-8 border-b pb-2">
    Applications for Job: <span className="text-gray-700">{jobTitle || jobId}</span>
  </h2>

  {applications.length === 0 ? (
    <p className="text-gray-500 text-lg">No applications yet for this job.</p>
  ) : (
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {applications.map((app) => (
        <div
          key={app._id}
          className="bg-white border border-gray-100 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-6 space-y-4"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-gray-800 text-lg font-semibold">
              <FaUser className="text-[#027070]" />
              <span>{app.name}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <FaEnvelope className="text-[#027070]" />
              <a href={`mailto:${app.email}`} className="hover:underline break-all">{app.email}</a>
            </div>
          </div>

          <div className="text-sm text-gray-700">
            <p className="font-medium mb-1">Message:</p>
            <p className="text-gray-600 line-clamp-4">{app.message}</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 pt-2">
            <a
              href={app.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex justify-center items-center gap-2 text-sm text-white bg-[#027070] hover:bg-[#026060] px-4 py-2 rounded-lg transition"
            >
              <FaDownload /> View Resume
            </a>
            <button
              onClick={() => handleDelete(app._id)}
              className="flex-1 inline-flex justify-center items-center gap-2 text-sm text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition"
            >
              🗑️ Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  )}
</div>

  );
};

export default JobApplications;
