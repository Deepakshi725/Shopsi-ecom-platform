// eslint-disable-next-line
import React, { useEffect, useState } from "react";
import Product from "../components/products";
import Nav from "../components/nav";
import axios from "../axiosConfig";
import { Link, useNavigate } from "react-router-dom";
import { server } from "../server";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const email = useSelector((state) => state.user.email);

  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated || !email) {
      navigate('/');
      return;
    }

    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${server}/api/v2/product/get-products`);
        if (response.data && Array.isArray(response.data.products)) {
          setProducts(response.data.products);
        } else {
          throw new Error('Invalid response format');
        }
      } catch (err) {
        console.error("❌ Error fetching products:", err);
        const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch products';
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [isAuthenticated, email, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#222831] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#76ABAE] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-[#EEEEEE] text-xl">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#222831] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 text-xl mb-4">Error: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-[#76ABAE] hover:bg-[#5b8d90] text-white px-4 py-2 rounded-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Nav />
      <div className="min-h-screen bg-[#222831] px-6 py-12 flex flex-col justify-center sm:px-6 lg:px-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-center text-[#EEEEEE] py-6">
          Product Gallery
        </h1>
        {products.length === 0 ? (
          <div className="text-center text-[#EEEEEE] text-xl">
            No products available
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {products.map((product) => (
              <Product key={product._id} {...product} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
