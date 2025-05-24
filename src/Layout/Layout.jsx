import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { FaArrowUp, FaWhatsapp, FaPhoneAlt } from 'react-icons/fa';
import { FaChevronUp } from "react-icons/fa";

const Layout = () => {
  const [showScrollToTop, setShowScrollToTop] = useState(false);

  // Show the scroll-to-top button when the user scrolls down
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollToTop(window.scrollY > 200);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll to the top of the page
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col min-h-screen bg-white ">
      <Header />
      <main className="flex-1 pt-20">
        <Outlet />
      </main>
      <Footer />

      {/* Scroll to Top Button */}
{/* Scroll to Top Button */}
{showScrollToTop && (
  <button
    onClick={scrollToTop}
    className="group fixed bottom-20 right-5 md:right-10 lg:right-20 bg-indigo-600 text-white p-3 rounded-xl rotate-[45deg] hover:scale-110 shadow-lg hover:bg-blue-700/50 transition cursor-pointer"
    aria-label="Scroll to top"
  >
    <FaChevronUp className='-rotate-45 group-hover:scale-130 group-hover:text-gray-200'/>
  </button>
)}

{/* WhatsApp and Call Inquiry Buttons */}
<div className="fixed bottom-20 left-5 md:left-10 lg:left-20 z-50 flex flex-col items-center space-y-4">
  {/* WhatsApp */}
  <a
    href="https://wa.me/9384812940"
    target="_blank"
    rel="noopener noreferrer"
    className="group relative bg-green-700 hover:bg-white/20 backdrop-blur-md p-3 rounded-full border border-white/30 shadow-xl transition-all hover:scale-110"
    aria-label="WhatsApp Inquiry"
  >
    <FaWhatsapp className="text-white group-hover:text-green-500 text-xl" />
    <span className="absolute left-14 top-1/2 -translate-y-1/2 text-xs font-medium bg-green-500 text-white px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-md">
      Chat on WhatsApp
    </span>
  </a>

  {/* Call */}
  <a
    href="tel:+919384812940"
    className="group relative bg-blue-300 hover:bg-white/20 backdrop-blur-md p-3 rounded-full border border-white/30 shadow-xl transition-all hover:scale-110"
    aria-label="Call Inquiry"
  >
    <FaPhoneAlt className="text-blue-500 text-base" />
    <span className="absolute left-14 top-1/2 -translate-y-1/2 text-xs font-medium bg-blue-600 text-white px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-md">
      Call Now
    </span>
  </a>
</div>

    </div>
  );
};

export default Layout;
