import React, { useState, useEffect } from 'react';

const AdminSettings = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    setUsername(localStorage.getItem('adminUsername') || '');
    setPassword(localStorage.getItem('adminPassword') || '');
  }, []);

  const handleUpdate = (e) => {
    e.preventDefault();
    localStorage.setItem('adminUsername', username);
    localStorage.setItem('adminPassword', password);
    alert('Admin credentials updated!');
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow rounded mt-10">
      <h2 className="text-2xl font-bold mb-4">Update Admin Credentials</h2>
      <form onSubmit={handleUpdate} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Username</label>
          <input
            type="text"
            className="w-full px-4 py-2 border rounded"
            // value={username}
            placeholder='Enter new username'
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Password</label>
          <input
            type="password"
            className="w-full px-4 py-2 border rounded"
            // value={password}
            placeholder='Enter new password'
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default AdminSettings;
