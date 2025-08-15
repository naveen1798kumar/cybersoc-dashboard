import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminCredentials } from './config/adminConfig';

import backgroundImage from '../src/assets/home-automtion.JPG';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (
      username.trim() === adminCredentials.username &&
      password.trim() === adminCredentials.password
    ) {
      localStorage.setItem('isAdmin', 'true');
      navigate('/dashboard');
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div
      className="flex h-screen items-center justify-center bg-cover bg-center relative"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Semi-transparent overlay with backdrop blur (blurs the background image) */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-md z-10 pointer-events-none"
        style={{ WebkitBackdropFilter: 'blur(8px)', backdropFilter: 'blur(8px)' }}
      />

      {/* Glassmorphic form above overlay */}
      <div className="relative z-20 w-full max-w-md p-8 bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20">
        <h2 className="text-3xl font-bold text-center text-white drop-shadow-lg">
          Cybersoc Admin Login
        </h2>

        <form onSubmit={handleLogin} className="mt-6 space-y-4">
          {error && <p className="text-red-400 text-center">{error}</p>}

          <div>
            <label className="block mb-1 font-semibold text-white">Username</label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-white/30 rounded bg-white/80 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold text-white">Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 border border-white/30 rounded bg-white/80 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 text-white bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
