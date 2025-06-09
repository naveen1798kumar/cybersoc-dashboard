import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Moment from 'moment';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';
import { assets } from '../assets/assets/assets/assets'; // Ensure this is correctly imported

const BlogView = () => {
  const { id } = useParams();
  const { axios } = useAppContext();

  const [data, setData] = useState(null);

  const fetchBlogData = async () => {
    try {
      const { data } = await axios.get(`/blogs/${id}`); // ✅ Correct endpoint
      data.success ? setData(data.blog) : toast.error(data.message);
    } catch (error) {
      toast.error("Something went wrong while fetching the blog data.");
      console.error("Error fetching blog data:", error);
    }
  };

  useEffect(() => {
    fetchBlogData();
  }, [id]);

  return data ? (
    <div className="relative">
      <img
        src={assets.gradientBackground}
        alt=""
        className="absolute -top-50 -z-1 opacity-50"
      />
      {/* Add Navbar back if needed */}
      <div className="text-center mt-20 text-gray-600">
        <p className="text-primary py-4 font-medium">
          Published on {Moment(data.createdAt).format('MMMM Do YYYY')}
        </p>
        <h2 className="text-2xl sm:text-5xl font-semibold max-w-2xl mx-auto text-gray-800">
          {data.title}
        </h2>
        <h3 className="my-5 max-w-lg truncate mx-auto">{data.subTitle}</h3>
        <p className="inline-block py-1 px-4 rounded-full mb-6 border text-sm border-primary/35 bg-primary/5 font-medium text-primary">
          {data.author || 'Admin'}
        </p>
      </div>

      <div className="mx-5 max-w-5xl md:mx-auto my-10 mt-6">
        <img src={data.image} alt="" className="rounded-3xl mb-5" />
        <div
          className="rich-text max-w-3xl mx-auto"
          dangerouslySetInnerHTML={{ __html: data.description }}
        ></div>
      </div>
    </div>
  ) : (
    <div>Loading...</div>
  );
};

export default BlogView;
