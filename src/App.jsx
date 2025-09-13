// App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Admin Pages
import AdminLogin from './AdminLogin';
import AdminLayout from './Layout/AdminLayout';
import AdminDashboard from './AdminDashboard';
import AdminServices from './Pages/AdminServices';
import AdminBlogs from './Pages/AdminBlogs';
import AdminCareers from './Pages/AdminCareers';
import JobApplications from './Pages/JobApplications';
import AdminProducts from './pages/AdminProducts';
import AdminSettings from './pages/AdminSettings';
import EditBlog from './Pages/EditBlog';
import EditServicePage from './pages/EditServicePage';
import AdminServiceForm from  './Pages/AdminServiceForm';
import BlogView from './Pages/BlogView'; 

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import AOS from 'aos';
import 'aos/dist/aos.css';
import ServiceList from './Pages/ServiceList';
import ServiceDetail from './Pages/ServiceDetail';

import AdminContactMessages from './components/contactComponents/AdminContactMessages';
import AdminServicesDropdown from './components/contactComponents/AdminServicesDropdown';


// 
import 'quill/dist/quill.snow.css'
import {Toaster} from 'react-hot-toast'
import { useAppContext } from './context/AppContext'
import AdminContactDashboard from './Pages/AdminContactDashboard';
import AdminAddJob from './Pages/AdminAddJob';

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

          {/* Ssevices */}
          <Route path="services" element={<AdminServices />} />
          <Route path="services/add" element={<AdminServiceForm />} />
          <Route path="services/:id/edit" element={<AdminServiceForm />} />
          <Route path="services/:id" element={<ServiceDetail />} />
          <Route path="services/edit/:serviceId" element={<EditServicePage />} />

          <Route path="blogs" element={<AdminBlogs />} />
          <Route path="blogs/:id" element={<BlogView />} />
          <Route path="blogs/add" element={<EditBlog isNew={true} />} />
          <Route path="blogs/edit/:id" element={<EditBlog />} />

          {/* <Route path="contact-messages" element={<AdminContactMessages />} />
          <Route path="services-dropdown" element={<AdminServicesDropdown />} /> */}
          <Route path="contact-dashboard" element={<AdminContactDashboard />} />

          <Route path="careers" element={<AdminCareers />} />
          <Route path="careers/add" element={<AdminAddJob />} />
          <Route path="careers/:jobId/applications" element={<JobApplications />} />

          <Route path="products" element={<AdminProducts />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
      </Routes>

    </div>
  );
}

export default App;
