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

import BlogView from './Pages/BlogView'; 

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import AOS from 'aos';
import 'aos/dist/aos.css';
import ServiceList from './Pages/ServiceList';
import ServiceDetail from './Pages/ServiceDetail';

// 
import 'quill/dist/quill.snow.css'
import {Toaster} from 'react-hot-toast'
import { useAppContext } from './context/AppContext'

function App() {
  const {token} = useAppContext()
  // const [loading, setLoading] = useState(true);
  // useEffect(() => {
  //   AOS.init({ duration: 1000, once: true });
  //   setTimeout(() => setLoading(false), 1000);
  // }, []);
  // if (loading) return <Loading />;

  return (
    <div>
      <Toaster />

      <Routes>
        {/* Admin Routes */}
        <Route path="/" element={<AdminLogin />} />
        <Route path="/dashboard" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="services" element={<AdminServices />} />
          <Route path="services/:id" element={<ServiceDetail />} />
          <Route path="services/edit/:serviceId" element={<EditServicePage />} />
          <Route path="blogs" element={<AdminBlogs />} />
          <Route path="blogs/:id" element={<BlogView />} />

          <Route path="blogs/add" element={<EditBlog isNew={true} />} />
          <Route path="blogs/edit/:id" element={<EditBlog />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
      </Routes>

    </div>
  );
}

export default App;
