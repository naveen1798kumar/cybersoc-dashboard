// App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Admin Pages
import AdminLogin from './AdminLogin';
import AdminLayout from './Layout/AdminLayout';
import AdminDashboard from './AdminDashboard';
import AdminServices from './Pages/AdminServices';
import AdminBlogs from './Pages/AdminBlogs';
import AdminProducts from './pages/AdminProducts';
import AdminSettings from './pages/AdminSettings';
import EditBlog from './Pages/EditBlog';
import EditServicePage from './pages/EditServicePage';


import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import AOS from 'aos';
import 'aos/dist/aos.css';

function App() {
  // const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   AOS.init({ duration: 1000, once: true });
  //   setTimeout(() => setLoading(false), 1000);
  // }, []);

  // if (loading) return <Loading />;

  return (
    <Router>
      <Routes>
        {/* Admin Routes */}
        <Route path="/" element={<AdminLogin />} />
        <Route path="/dashboard" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="services" element={<AdminServices />} />
          <Route path="services/edit/:serviceId" element={<EditServicePage />} />
          <Route path="blogs" element={<AdminBlogs />} />
          <Route path="blogs/add" element={<EditBlog isNew={true} />} />
          <Route path="blogs/edit/:id" element={<EditBlog />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
