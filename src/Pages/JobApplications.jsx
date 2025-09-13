// JobApplications.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { FaDownload, FaEnvelope, FaUser, FaCheck, FaTimes } from "react-icons/fa";
import { motion } from "framer-motion";

const JobApplications = () => {
  const { jobId } = useParams();
  const [applications, setApplications] = useState([]);
  const [jobTitle, setJobTitle] = useState("");

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await axios.get(`/api/career/${jobId}/applications`);
        setApplications(res.data.applications);
        setJobTitle(res.data.jobTitle);
      } catch (err) {
        console.error("Error fetching applications");
      }
    };
    fetchApplications();
  }, [jobId]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this application?")) return;
    try {
      await axios.delete(`/api/career/application/${id}`);
      setApplications((prev) => prev.filter((app) => app._id !== id));
    } catch (err) {
      alert("Failed to delete. Try again.");
    }
  };

  return (
    <div className="p-6 md:p-10 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold text-[#027070] mb-8 border-b pb-2">
        Applications for:{" "}
        <span className="text-gray-700">{jobTitle || jobId}</span>
      </h2>

      {applications.length === 0 ? (
        <p className="text-gray-500 text-lg">No applications yet.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {applications.map((app, index) => (
            <motion.div
              key={app._id}
              className="bg-white border rounded-2xl shadow-md hover:shadow-xl transition-all p-6 space-y-4 relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              {/* Candidate */}
              <div className="flex items-center gap-3">
                <div className="bg-[#027070] text-white w-12 h-12 flex items-center justify-center rounded-full font-bold">
                  {app.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-lg font-semibold text-gray-800">{app.name}</p>
                  <a
                    href={`mailto:${app.email}`}
                    className="text-sm text-[#027070] hover:underline"
                  >
                    {app.email}
                  </a>
                </div>
              </div>

              {/* Message */}
              <p className="text-sm text-gray-600 line-clamp-3">{app.message}</p>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-2">
                <a
                  href={app.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 text-sm bg-[#027070] text-white py-2 rounded-lg hover:bg-[#025a5a] transition"
                >
                  <FaDownload /> View Resume
                </a>
                <button
                  onClick={() => handleDelete(app._id)}
                  className="flex-1 flex items-center justify-center gap-2 text-sm bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition"
                >
                  <FaTimes /> Delete
                </button>
              </div>

              {/* Status badge */}
              <span className="absolute top-4 right-4 text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-800">
                New
              </span>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobApplications;
