import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAppContext } from "../../context/AppContext";

const AdminContactMessages = () => {
  const { axios: api } = useAppContext(); // uses your AppContext axios with baseURL
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data } = await api.get("/api/contact-messages");
        if (data.success) setMessages(data.messages);
      } catch (err) {
        console.error("Error fetching messages", err);
      }
    };
    fetchMessages();
  }, [api]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">📩 Contact Messages</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 rounded-lg shadow-md">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border">Name</th>
              <th className="px-4 py-2 border">Email</th>
              <th className="px-4 py-2 border">Mobile</th>
              <th className="px-4 py-2 border">Service</th>
              <th className="px-4 py-2 border">Message</th>
              <th className="px-4 py-2 border">Date</th>
            </tr>
          </thead>
          <tbody>
            {messages.map((msg) => (
              <tr key={msg._id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border">{msg.name}</td>
                <td className="px-4 py-2 border">{msg.email}</td>
                <td className="px-4 py-2 border">{msg.mobile}</td>
                <td className="px-4 py-2 border">{msg.service}</td>
                <td className="px-4 py-2 border">{msg.message}</td>
                <td className="px-4 py-2 border">
                  {new Date(msg.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminContactMessages;
