// AdminCareers.jsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaTrash, FaEye, FaPlus } from "react-icons/fa";
import toast from "react-hot-toast";

const AdminCareers = () => {
  const [jobs, setJobs] = useState([]);
  const navigate = useNavigate();

  const fetchJobs = async () => {
    try {
      const res = await axios.get("/api/jobs");
      setJobs(res.data);
    } catch (err) {
      toast.error("Failed to fetch jobs");
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const deleteJob = async (id) => {
    if (!window.confirm("Delete this job?")) return;
    try {
      await axios.delete(`/api/jobs/${id}`);
      toast.success("Job deleted successfully");
      fetchJobs();
    } catch (err) {
      toast.error("Failed to delete job");
    }
  };

  return (
    <div className="p-6 space-y-10">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-[#027070]">Career Listings</h2>
        <button
          onClick={() => navigate("/dashboard/careers/add")}
          className="flex items-center gap-2 bg-[#027070] hover:bg-[#025a5a] text-white px-5 py-2 rounded-lg font-semibold shadow-md transition"
        >
          <FaPlus /> Post New Job
        </button>
      </div>

      {/* Job Table */}
      <div className="overflow-x-auto bg-white rounded-xl shadow-md border border-gray-100">
        <table className="w-full text-left">
          <thead className="bg-gray-100 text-gray-700 uppercase text-sm">
            <tr>
              <th className="p-4">Title</th>
              <th className="p-4">Type</th>
              <th className="p-4">Location</th>
              <th className="p-4">Openings</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr
                key={job._id}
                className="border-t hover:bg-gray-50 transition"
              >
                <td className="p-4 font-medium">{job.title}</td>
                <td className="p-4">
                  <span className="px-3 py-1 text-xs rounded-full bg-teal-100 text-teal-700">
                    {job.type}
                  </span>
                </td>
                <td className="p-4">{job.location}</td>
                <td className="p-4">{job.openings}</td>
                <td className="p-4 flex gap-3">
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
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminCareers;
