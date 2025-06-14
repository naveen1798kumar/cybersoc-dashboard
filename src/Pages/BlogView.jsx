import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Moment from 'moment';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';
import { assets } from '../assets/assets/assets/assets';
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
} from 'react-icons/fa';
import { FaXTwitter } from "react-icons/fa6";

const BlogView = () => {
  const { id } = useParams();
  const { axios } = useAppContext();
  const [data, setData] = useState(null);

  const fetchBlogData = async () => {
    try {
      const { data } = await axios.get(`/blogs/${id}`);
      data.success ? setData(data.blog) : toast.error(data.message);
    } catch (error) {
      toast.error('Something went wrong while fetching the blog data.');
      console.error('Error fetching blog data:', error);
    }
  };

  useEffect(() => {
    fetchBlogData();
  }, [id]);

  return data ? (
    <div className="relative min-h-screen flex flex-col">
      {/* Background */}
      <img
        src={assets.gradientBackground}
        alt=""
        className="absolute top-0 left-0 w-full h-full object-cover opacity-20 -z-10"
      />

      {/* Blog Content */}
      <main className="flex-grow py-16 px-5 sm:px-10 text-gray-800">

        <div className="max-w-4xl mx-auto">
          <img
            src={data.image}
            alt="Blog Banner"
            className="w-full h-auto rounded-3xl shadow-lg mb-6"
          />

          <div className=" mb-10">
          <h1 className="text-3xl sm:text-5xl font-bold max-w-2xl mx-auto text-gray-800 leading-tight">
            {data.title}
          </h1>
          <h3 className="mt-1 text-lg text-gray-500">{data.subTitle}</h3>
          <p className="text-primary font-medium my-2">
            Published on {Moment(data.createdAt).format('MMMM Do YYYY')}
          </p>
        </div>

          <div
            className="prose max-w-none prose-lg prose-gray"
            dangerouslySetInnerHTML={{ __html: data.description }}
          />
        </div>
      
<section className="max-w-4xl mx-auto bg-gray-50 mt-10 py-10 border-t border-gray-200">
  <div className="max-w-6xl mx-auto px-6 ">
    <h3 className="relative text-3xl sm:text-4xl font-semibold text-gray-800 mb-4">
      Follow Us
    <div className="absolute w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mt-2 mb-4 rounded-full"></div>
    </h3>

    <div className="flex  space-x-5 text-2xl pt-4">
      <a
        href="https://facebook.com"
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-500 hover:text-blue-600 transition duration-300"
      >
        <FaFacebookF />
      </a>
      <a
        href="https://instagram.com"
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-500 hover:text-pink-500 transition duration-300"
      >
        <FaInstagram />
      </a>
      <a
        href="https://linkedin.com"
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-500 hover:text-blue-700 transition duration-300"
      >
        <FaLinkedinIn />
      </a>
      <a
        href="https://twitter.com"
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-500 hover:text-sky-400 transition duration-300"
      >
        <FaXTwitter />
      </a>
      <a
        href="https://youtube.com"
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-500 hover:text-red-600 transition duration-300"
      >
        <FaYoutube />
      </a>
    </div>
  </div>
</section>

      </main>

    </div>
  ) : (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-500 text-lg">Loading blog...</p>
    </div>
  );
};

export default BlogView;
