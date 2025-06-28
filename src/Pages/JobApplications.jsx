// Pages/JobApplications.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { FaDownload, FaEnvelope, FaUser } from 'react-icons/fa';

const JobApplications = () => {
  const { jobId } = useParams();
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await axios.get(`/api/jobs/${jobId}/applications`);
        setApplications(res.data);
      } catch (err) {
        console.error('Error fetching applications');
      }
    };
    fetchApplications();
  }, [jobId]);

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-3xl font-bold text-[#027070] mb-6">Applications for Job #{jobId}</h2>

      {applications.length === 0 ? (
        <p className="text-gray-500">No applications yet for this job.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {applications.map((app, idx) => (
            <div
              key={idx}
              className="bg-white border border-gray-200 rounded-xl p-5 shadow-md hover:shadow-lg transition"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-gray-800">
                  <FaUser className="text-[#027070]" />
                  <span className="font-semibold">{app.name}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <FaEnvelope className="text-[#027070]" />
                  <a href={`mailto:${app.email}`} className="hover:underline">{app.email}</a>
                </div>
                <div className="text-sm text-gray-700">
                  <p className="font-medium">Message:</p>
                  <p className="text-gray-600 mt-1 line-clamp-4">{app.message}</p>
                </div>
                <div className="mt-3">
                  <a
                    href={app.resume}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-white bg-[#027070] hover:bg-[#026060] px-4 py-2 rounded"
                  >
                    <FaDownload /> View Resume
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobApplications;
