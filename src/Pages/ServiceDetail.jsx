import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ServiceDetail = () => {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`/api/services/${id}`)
      .then(res => setService(res.data))
      .catch(() => setService(null));
  }, [id]);

  if (!service) return <div className="p-6 text-center text-gray-500">Loading...</div>;

  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 min-h-screen py-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header & Image */}
        <div className="relative">
          {service.image && (
            <img
              src={service.image}
              alt={service.title}
              className="w-full h-64 object-cover"
            />
          )}
          <button
            onClick={() => navigate(-1)}
            className="absolute top-4 left-4 bg-white/80 hover:bg-white text-blue-700 px-4 py-2 rounded shadow font-semibold transition"
            type="button"
          >
            &larr; Back to Services
          </button>
          <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/60 to-transparent px-8 py-6">
            <h1 className="text-3xl md:text-4xl font-extrabold text-white drop-shadow">{service.title}</h1>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-8 space-y-8">
          {/* Description */}
          <p className="text-lg text-gray-700">{service.description}</p>

          {/* Sections */}
          {service.sections?.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-blue-700 mb-4">Details</h2>
              <div className="space-y-4">
                {service.sections.map((sec, idx) => (
                  <div key={idx}>
                    <h3 className="text-lg font-semibold text-gray-800">{sec.title}</h3>
                    <p className="text-gray-600">{sec.content}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Benefits */}
          {service.benefits?.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-blue-700 mb-4">Key Benefits</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                {service.benefits.map((b, idx) => (
                  <li key={idx}>{b}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Features */}
          {service.features?.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-blue-700 mb-4">Features</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {service.features.map((f, idx) => (
                  <div key={idx} className="bg-blue-50 rounded-lg p-4 shadow">
                    <h4 className="font-semibold text-blue-800">{f.title}</h4>
                    <p className="text-gray-700">{f.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* FAQs */}
          {service.faqs?.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-blue-700 mb-4">FAQs</h2>
              <div className="space-y-4">
                {service.faqs.map((faq, idx) => (
                  <div key={idx} className="bg-gray-50 rounded-lg p-4 shadow">
                    <h5 className="font-semibold text-gray-800">Q: {faq.question}</h5>
                    <p className="text-gray-700 mt-1">A: {faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServiceDetail;